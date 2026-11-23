'use client';

import { login } from '@/actions/login';
import { useActionState } from 'react';


export default function LoginPage() {

  const [state, formAction, isPending] = useActionState(login, {
    error: null,
  })

  const {  error } = state
  
  return (
    <main className="login-container">
        <h1>Entrar na plataforma</h1>
        <form action={formAction} className="login-form">
        <label htmlFor="email">E-mail</label>
        <input className="login-input" id="email" name="email" type="email" required />

        <label htmlFor="password">Senha</label>
        <input className="login-input" id="password" name="password" type="password" required />

        <button className="login-button" disabled={isPending} type="submit">
          Entrar
        </button>
        {error && <p className="login-error" role="alert">{error}</p>}
        </form>
    </main>
    
  );
}