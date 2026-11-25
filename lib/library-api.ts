import "server-only";

import { cookies } from "next/headers";

const API_BASE_URL = (process.env.API_URL?.trim() || "http://localhost:3000/v1")
  .replace(/\/+$/, "");

export class LibraryApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "LibraryApiError";
  }
}

export async function libraryApi<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = (await cookies()).get("jwt_access_token")?.value;
  if (!token) {
    throw new LibraryApiError("Sua sessão expirou. Entre novamente.", 401);
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });
  const responseText = await response.text();

  let data: unknown;
  if (responseText) {
    try {
      data = JSON.parse(responseText) as unknown;
    } catch {
      if (response.ok) {
        throw new LibraryApiError("A API retornou uma resposta inválida.", response.status);
      }
    }
  }

  if (!response.ok) {
    const apiMessage = data && typeof data === "object"
      ? "error" in data && typeof data.error === "string"
        ? data.error
        : "message" in data && typeof data.message === "string"
          ? data.message
          : null
      : null;
    const fallback = response.status === 401
      ? "Sua sessão expirou. Entre novamente."
      : response.status === 403
        ? "Seu perfil não tem permissão para esta operação."
        : "Não foi possível concluir a operação na API.";
    throw new LibraryApiError(apiMessage ?? fallback, response.status);
  }

  return data as T;
}

export function apiErrorMessage(error: unknown): string {
  return error instanceof LibraryApiError
    ? error.message
    : "Não foi possível conectar à API da biblioteca.";
}
