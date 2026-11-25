"use client";

import { useActionState } from "react";
import { createAttendant, type CreateAttendantState } from "@/actions/admin";

const initialState: CreateAttendantState = { error: null, success: null };

export default function AttendantForm() {
  const [state, formAction, isPending] = useActionState(createAttendant, initialState);

  return (
    <section className="usuarios-card" aria-labelledby="novo-atendente-titulo">
      <div className="usuarios-card-header">
        <h2 id="novo-atendente-titulo">Cadastrar atendente</h2>
        <p>A conta será criada como Atendente (`isAdmin = false`).</p>
      </div>
      <form action={formAction} className="usuarios-attendant-form">
        <label htmlFor="attendant-name">
          Nome completo
          <input
            id="attendant-name"
            name="name"
            type="text"
            autoComplete="name"
            minLength={2}
            maxLength={120}
            required
          />
        </label>
        <label htmlFor="attendant-email">
          E-mail
          <input
            id="attendant-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
          />
        </label>
        <label htmlFor="attendant-username">
          Nome de usuário
          <input
            id="attendant-username"
            name="username"
            type="text"
            autoComplete="username"
            minLength={3}
            maxLength={60}
            required
          />
        </label>
        <label htmlFor="attendant-password">
          Senha inicial
          <input
            id="attendant-password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={12}
            maxLength={128}
            required
          />
        </label>
        <button type="submit" disabled={isPending}>
          {isPending ? "Cadastrando..." : "Cadastrar atendente"}
        </button>
        {state.error && (
          <p className="usuarios-form-message usuarios-form-error" role="alert">
            {state.error}
          </p>
        )}
        {state.success && (
          <p className="usuarios-form-message usuarios-form-success" role="status">
            {state.success}
          </p>
        )}
      </form>
    </section>
  );
}
