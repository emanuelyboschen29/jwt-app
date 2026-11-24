'use client';

import Link from 'next/link';
import { login } from '@/actions/login';
import { useActionState } from 'react';


export default function LoginPage() {

  const [state, formAction, isPending] = useActionState(login, {
    error: null,
  })

  const {  error } = state
  
  return (
    <main className="login-container">
      <div
        className="login-visual"
        role="img"
        aria-label="Pessoa lendo em uma livraria"
      />

      <section className="login-panel">
        <h1>Entrar na plataforma</h1>
        <form action={formAction} className="login-form">
        <label htmlFor="email">E-mail</label>
        <input className="login-input" id="email" name="email" type="email" required />

        <label htmlFor="password">Senha</label>
        <input className="login-input" id="password" name="password" type="password" maxLength={128} required />

        <button className="login-button" disabled={isPending} type="submit">
          Entrar
        </button>
        {error && <p className="login-error" role="alert">{error}</p>}
        </form>
        <p className="login-register">
          Ainda não tem uma conta? <Link href="/cadastro">Cadastre-se</Link>
        </p>
      </section>
    </main>
    
  );
}