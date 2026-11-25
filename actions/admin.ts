"use server";

import { cookies } from "next/headers";
import { refresh, revalidatePath } from "next/cache";
import { isUserRole, type UserRole } from "@/lib/roles";
import { getCurrentUser, syncApiUser, updateUserRoleForAdmin } from "@/lib/auth";

export type RoleFormState = {
  error: string | null;
  success: string | null;
  role: UserRole | null;
};

export async function updateUserRole(
  _previousState: RoleFormState,
  formData: FormData,
): Promise<RoleFormState> {
  const userIdValue = formData.get("userId");
  const roleValue = formData.get("role");
  const userId = typeof userIdValue === "string" ? Number(userIdValue) : NaN;

  if (!Number.isSafeInteger(userId) || userId < 1 || !isUserRole(roleValue)) {
    return { error: "Dados de permissão inválidos.", success: null, role: null };
  }

  const result = await updateUserRoleForAdmin(userId, roleValue);
  if (!result.ok) {
    return { error: result.error, success: null, role: null };
  }

  revalidatePath("/dashboard/usuarios");
  refresh();
  return { error: null, success: "Papel atualizado.", role: roleValue };
}

export type CreateAttendantState = {
  error: string | null;
  success: string | null;
};

export async function createAttendant(
  _previousState: CreateAttendantState,
  formData: FormData,
): Promise<CreateAttendantState> {
  const actor = await getCurrentUser();
  if (!actor || actor.role !== "admin") {
    return { error: "Somente um administrador pode cadastrar atendentes.", success: null };
  }

  const name = formData.get("name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const username = formData.get("username")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (name.length < 2 || name.length > 120) {
    return { error: "Informe um nome entre 2 e 120 caracteres.", success: null };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return { error: "Informe um e-mail válido.", success: null };
  }
  if (!/^[a-zA-Z0-9._-]{3,60}$/.test(username)) {
    return { error: "O usuário deve ter de 3 a 60 caracteres: letras, números, ponto, hífen ou sublinhado.", success: null };
  }
  if (password.length < 12 || password.length > 128) {
    return { error: "A senha deve ter entre 12 e 128 caracteres.", success: null };
  }

  const accessToken = (await cookies()).get("jwt_access_token")?.value;
  if (!accessToken) {
    return { error: "Sua sessão expirou. Entre novamente.", success: null };
  }

  try {
    const apiUrl = process.env.API_URL?.trim() || "http://localhost:3000/v1";
    const response = await fetch(`${apiUrl}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name,
        username,
        email,
        password,
        isAdmin: false,
        active: true,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    const result = await response.json() as {
      id?: number;
      name?: string;
      email?: string;
      isAdmin?: boolean;
      error?: string;
    };

    if (!response.ok) {
      return {
        error: result.error ?? "Não foi possível cadastrar o atendente.",
        success: null,
      };
    }

    if (
      !Number.isSafeInteger(result.id)
      || !result.name
      || !result.email
      || typeof result.isAdmin !== "boolean"
    ) {
      throw new Error("A API retornou dados inválidos para o atendente criado.");
    }

    await syncApiUser({
      id: result.id as number,
      name: result.name,
      email: result.email,
      isAdmin: result.isAdmin,
    });

    revalidatePath("/dashboard/usuarios");
    refresh();
    return { error: null, success: "Atendente cadastrado com sucesso." };
  } catch (error) {
    console.error("Attendant registration failed:", error);
    return { error: "Não foi possível cadastrar o atendente. Verifique a conexão com a API.", success: null };
  }
}
