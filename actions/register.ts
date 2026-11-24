"use server";

import {
  createReaderAccount,
  EmailAlreadyRegisteredError,
} from "@/lib/auth";

export type RegistrationFormState = {
  error: string | null;
  success: string | null;
};

export async function registerReader(
  _previousState: RegistrationFormState,
  formData: FormData,
): Promise<RegistrationFormState> {
  const name = formData.get("name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";

  if (name.length < 2 || name.length > 120) {
    return { error: "Informe seu nome completo.", success: null };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return { error: "Informe um e-mail válido.", success: null };
  }

  if (password.length < 12 || password.length > 128) {
    return { error: "A senha deve ter entre 12 e 128 caracteres.", success: null };
  }

  if (password !== confirmPassword) {
    return { error: "As senhas não conferem.", success: null };
  }

  try {
    await createReaderAccount(name, email, password);
  } catch (error) {
    if (error instanceof EmailAlreadyRegisteredError) {
      return { error: error.message, success: null };
    }

    console.error("Reader registration failed:", error);
    return { error: "Não foi possível concluir o cadastro. Tente novamente.", success: null };
  }

  return {
    error: null,
    success: "Cadastro concluído com perfil de leitor. Agora você pode entrar.",
  };
}
