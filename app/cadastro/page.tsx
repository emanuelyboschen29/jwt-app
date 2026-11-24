"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerReader } from "@/actions/register";

const initialState = { error: null, success: null };

export default function RegistrationPage() {
  const [state, formAction, isPending] = useActionState(registerReader, initialState);

  return (
    <main className="login-container">
      <div
        className="login-visual"
        role="img"
        aria-label="Pessoa lendo em uma livraria"
      />

      <section className="login-panel">
        <h1>Criar conta</h1>
        <p className="login-description">
          O cadastro cria uma conta com perfil de leitor.
        </p>

        <form action={formAction} className="login-form">
          <label htmlFor="name">Nome completo</label>
          <input
            className="login-input"
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            minLength={2}
            maxLength={120}
            required
          />

          <label htmlFor="email">E-mail</label>
          <input
            className="login-input"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
          />

          <label htmlFor="password">Senha</label>
          <input
            className="login-input"
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={12}
            maxLength={128}
            required
          />

          <label htmlFor="confirmPassword">Confirme a senha</label>
          <input
            className="login-input"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={12}
            maxLength={128}
            required
          />

          <button className="login-button" disabled={isPending || Boolean(state.success)} type="submit">
            {isPending ? "Cadastrando..." : "Criar conta"}
          </button>
          {state.error && <p className="login-error" role="alert">{state.error}</p>}
          {state.success && <p className="login-success" role="status">{state.success}</p>}
        </form>

        <p className="login-register">
          Já tem uma conta? <Link href="/">Entrar</Link>
        </p>
      </section>
    </main>
  );
}
