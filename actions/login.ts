"use server";

import { authenticateUser, createSession } from "@/lib/auth";
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
    const user = await authenticateUser(email, password);
    if (!user) {
      return { error: "E-mail ou senha inválidos." };
    }

    await createSession(user.id);
  } catch (error) {
    console.error("Login failed:", error);
    return { error: "Não foi possível iniciar a sessão. Verifique a configuração local." };
  }

  redirect("/dashboard");
}
