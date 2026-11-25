"use server";

import { cookies } from "next/headers";
import { createApiSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export type LoginFormState = {
  error: string | null;
};

export async function login(
  _previousState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) {
    return { error: "Informe o e-mail e a senha." };
  }
  if (password.length > 128) {
    return { error: "E-mail ou senha inválidos." };
  }

  try {
    const apiUrl = process.env.API_URL?.trim() || "http://localhost:3000/v1";
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      return { error: "E-mail ou senha inválidos." };
    }

    const result = await response.json() as {
      accessToken?: string;
      refreshToken?: string;
      user?: { id: number; name: string; email: string; isAdmin: boolean };
    };

    if (!result.accessToken || !result.refreshToken || !result.user) {
      throw new Error("A API retornou uma resposta de login incompleta.");
    }

    await createApiSession(result.user);

    const cookieStore = await cookies();
    cookieStore.set("jwt_access_token", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });
    cookieStore.set("jwt_refresh_token", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
  } catch (error) {
    console.error("Login failed:", error);
    return { error: "Não foi possível iniciar a sessão. Verifique a configuração local." };
  }

  redirect("/dashboard");
}
