import "server-only";

import { randomBytes, scrypt, createHash, timingSafeEqual } from "node:crypto";
import { DatabaseSync, type SQLOutputValue } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { isUserRole, type UserRole } from "@/lib/roles";

const SESSION_COOKIE = "session";
const SESSION_TTL_SECONDS = 12 * 60 * 60;
const PASSWORD_HASH_BYTES = 64;

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

type StoredUser = AuthUser & { passwordHash: string };
type SqlRow = Record<string, SQLOutputValue>;

type AuthGlobals = typeof globalThis & {
  __libraryAuthDatabase?: DatabaseSync;
  __libraryAuthReady?: Promise<void>;
};

const authGlobals = globalThis as AuthGlobals;

function readString(row: SqlRow | undefined, field: string): string | null {
  const value = row?.[field];
  return typeof value === "string" ? value : null;
}

function readNumber(row: SqlRow | undefined, field: string): number | null {
  const value = row?.[field];
  return typeof value === "number" ? value : null;
}

function toAuthUser(row: SqlRow | undefined): AuthUser | null {
  const id = readNumber(row, "id");
  const name = readString(row, "name");
  const email = readString(row, "email");
  const role = readString(row, "role");
  const createdAt = readString(row, "created_at");

  if (id === null || !name || !email || !isUserRole(role) || !createdAt) {
    return null;
  }

  return { id, name, email, role, createdAt };
}

function toStoredUser(row: SqlRow | undefined): StoredUser | null {
  const user = toAuthUser(row);
  const passwordHash = readString(row, "password_hash");

  return user && passwordHash ? { ...user, passwordHash } : null;
}

function findStoredUserByEmail(database: DatabaseSync, email: string): StoredUser | null {
  const row = database
    .prepare(
      `SELECT id, name, email, role, created_at, password_hash
       FROM users
       WHERE email = ?`,
    )
    .get(email);

  return toStoredUser(row);
}

function createDatabase(): DatabaseSync {
  const configuredPath = process.env.AUTH_DATABASE_PATH;
  const databasePath = configuredPath
    ? resolve(/*turbopackIgnore: true*/ process.cwd(), configuredPath)
    : join(process.cwd(), "data", "auth.sqlite");

  mkdirSync(dirname(databasePath), { recursive: true });

  const database = new DatabaseSync(databasePath);
  database.exec(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = 5000;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL COLLATE NOCASE UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin', 'librarian', 'reader')),
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS sessions_expires_at_idx
      ON sessions(expires_at);
  `);

  return database;
}

function derivePasswordHash(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolveHash, rejectHash) => {
    scrypt(password, salt, PASSWORD_HASH_BYTES, (error, derivedKey) => {
      if (error) {
        rejectHash(error);
      } else {
        resolveHash(derivedKey);
      }
    });
  });
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const hash = await derivePasswordHash(password, salt);
  return `${salt}:${hash.toString("hex")}`;
}

async function verifyPassword(password: string, encodedHash: string): Promise<boolean> {
  const [salt, hashHex] = encodedHash.split(":");
  if (!salt || !hashHex || !/^[a-f0-9]{128}$/i.test(hashHex)) {
    return false;
  }

  const expectedHash = Buffer.from(hashHex, "hex");
  const actualHash = await derivePasswordHash(password, salt);
  return expectedHash.length === actualHash.length
    && timingSafeEqual(expectedHash, actualHash);
}

function isValidEmail(email: string): boolean {
  return email.length <= 254
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function seedInitialAdmin(database: DatabaseSync): Promise<void> {
  const existingAdminCount = database
    .prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'admin'")
    .get();
  if ((readNumber(existingAdminCount, "count") ?? 0) > 0) {
    return;
  }

  const emailSetting = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  const passwordSetting = process.env.BOOTSTRAP_ADMIN_PASSWORD;

  if (Boolean(emailSetting) !== Boolean(passwordSetting)) {
    throw new Error("Configure BOOTSTRAP_ADMIN_EMAIL e BOOTSTRAP_ADMIN_PASSWORD juntos.");
  }

  if (!emailSetting || !passwordSetting) {
    return;
  }

  if (!isValidEmail(emailSetting) || passwordSetting.length < 16 || passwordSetting.length > 128) {
    throw new Error("O e-mail do administrador deve ser válido e a senha inicial ter entre 16 e 128 caracteres.");
  }

  const initialAdminHash = await hashPassword(passwordSetting);
  database.exec("BEGIN IMMEDIATE");

  try {
    const adminCountRow = database
      .prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'admin'")
      .get();
    const adminCount = readNumber(adminCountRow, "count") ?? 0;

    if (adminCount > 0) {
      database.exec("COMMIT");
      return;
    }

    const existingUser = findStoredUserByEmail(database, emailSetting);
    if (existingUser) {
      database
        .prepare(
          `UPDATE users
           SET name = 'Administrador',
               password_hash = ?,
               role = 'admin'
           WHERE email = ?`,
        )
        .run(initialAdminHash, emailSetting);
    } else {
      database
        .prepare(
          `INSERT INTO users (name, email, password_hash, role, created_at)
           VALUES (?, ?, ?, 'admin', ?)`,
        )
        .run("Administrador", emailSetting, initialAdminHash, new Date().toISOString());
    }
    database.exec("COMMIT");
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}

function getDatabase(): { database: DatabaseSync; ready: Promise<void> } {
  if (!authGlobals.__libraryAuthDatabase) {
    const database = createDatabase();
    authGlobals.__libraryAuthDatabase = database;
    authGlobals.__libraryAuthReady = seedInitialAdmin(database);
  }

  return {
    database: authGlobals.__libraryAuthDatabase,
    ready: authGlobals.__libraryAuthReady ?? Promise.resolve(),
  };
}

async function getReadyDatabase(): Promise<DatabaseSync> {
  const { database, ready } = getDatabase();
  await ready;
  return database;
}

export async function authenticateUser(
  email: string,
  password: string,
): Promise<AuthUser | null> {
  if (password.length > 128) {
    return null;
  }

  const database = await getReadyDatabase();
  const user = findStoredUserByEmail(database, email.trim().toLowerCase());

  if (!user) {
    await derivePasswordHash(password, "invalid-account-check");
    return null;
  }

  if (!(await verifyPassword(password, user.passwordHash))) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export async function syncApiUser(apiUser: {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}): Promise<void> {
  const database = await getReadyDatabase();
  const normalizedEmail = apiUser.email.trim().toLowerCase();
  const role: UserRole = apiUser.isAdmin ? "admin" : "librarian";
  const passwordHash = await hashPassword(randomBytes(32).toString("hex"));

  database
    .prepare(
      `INSERT INTO users (name, email, password_hash, role, created_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(email) DO UPDATE SET
         name = excluded.name,
         role = excluded.role`,
    )
    .run(apiUser.name, normalizedEmail, passwordHash, role, new Date().toISOString());
}

export async function createApiSession(apiUser: {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}): Promise<void> {
  await syncApiUser(apiUser);
  const database = await getReadyDatabase();
  const normalizedEmail = apiUser.email.trim().toLowerCase();
  const row = database
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(normalizedEmail);
  const localUserId = readNumber(row, "id");

  if (localUserId === null) {
    throw new Error("Não foi possível criar a sessão do usuário.");
  }

  await createSession(localUserId);
}

export async function createSession(userId: number): Promise<void> {
  const database = await getReadyDatabase();
  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + SESSION_TTL_SECONDS;

  database.prepare("DELETE FROM sessions WHERE expires_at <= ?").run(now);
  database
    .prepare(
      "INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)",
    )
    .run(tokenHash, userId, expiresAt, new Date().toISOString());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  await connection();
  const database = await getReadyDatabase();
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const row = database
    .prepare(
      `SELECT users.id, users.name, users.email, users.role, users.created_at
       FROM sessions
       JOIN users ON users.id = sessions.user_id
       WHERE sessions.token_hash = ? AND sessions.expires_at > ?`,
    )
    .get(tokenHash, Math.floor(Date.now() / 1000));

  return toAuthUser(row);
}

export async function requireUser(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }
  return user;
}

export async function requireAnyRole(roles: readonly UserRole[]): Promise<AuthUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) {
    redirect("/dashboard");
  }
  return user;
}

export async function listUsersForAdmin(): Promise<AuthUser[]> {
  await requireAnyRole(["admin"]);
  const database = await getReadyDatabase();
  const rows = database
    .prepare(
      `SELECT id, name, email, role, created_at
       FROM users
       WHERE role IN ('admin', 'librarian')
       ORDER BY name COLLATE NOCASE`,
    )
    .all();

  return rows.map((row) => {
    const user = toAuthUser(row);
    if (!user) {
      throw new Error("A base de usuários contém um registro inválido.");
    }
    return user;
  });
}

export type UpdateUserRoleResult =
  | { ok: true }
  | { ok: false; error: string };

export async function updateUserRoleForAdmin(
  targetUserId: number,
  nextRole: UserRole,
): Promise<UpdateUserRoleResult> {
  const actor = await getCurrentUser();
  if (!actor || actor.role !== "admin") {
    return { ok: false, error: "Somente um administrador pode alterar permissões." };
  }

  if (actor.id === targetUserId && nextRole !== "admin") {
    return { ok: false, error: "Você não pode remover seu próprio acesso de administrador." };
  }

  const database = await getReadyDatabase();
  database.exec("BEGIN IMMEDIATE");

  try {
    const actorRow = database
      .prepare("SELECT id, name, email, role, created_at FROM users WHERE id = ?")
      .get(actor.id);
    const currentActor = toAuthUser(actorRow);

    if (!currentActor || currentActor.role !== "admin") {
      database.exec("ROLLBACK");
      return { ok: false, error: "Somente um administrador pode alterar permissões." };
    }

    if (currentActor.id === targetUserId && nextRole !== "admin") {
      database.exec("ROLLBACK");
      return { ok: false, error: "Você não pode remover seu próprio acesso de administrador." };
    }

    const targetRow = database
      .prepare("SELECT id, name, email, role, created_at FROM users WHERE id = ?")
      .get(targetUserId);
    const target = toAuthUser(targetRow);

    if (!target) {
      database.exec("ROLLBACK");
      return { ok: false, error: "Usuário não encontrado." };
    }

    if (target.role === "admin" && nextRole !== "admin") {
      const countRow = database
        .prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'admin'")
        .get();
      const adminCount = readNumber(countRow, "count") ?? 0;

      if (adminCount <= 1) {
        database.exec("ROLLBACK");
        return { ok: false, error: "O sistema precisa manter pelo menos um administrador." };
      }
    }

    database.prepare("UPDATE users SET role = ? WHERE id = ?").run(nextRole, targetUserId);
    database.exec("COMMIT");
    return { ok: true };
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}

export async function deleteCurrentSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    const database = await getReadyDatabase();
    const tokenHash = createHash("sha256").update(token).digest("hex");
    database.prepare("DELETE FROM sessions WHERE token_hash = ?").run(tokenHash);
  }

  cookieStore.delete(SESSION_COOKIE);
}
