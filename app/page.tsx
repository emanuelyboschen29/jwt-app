'use client';

import Image from 'next/image';
import { login } from '@/actions/login';
import { useActionState } from 'react';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, {
    error: null,
  });
  const { error } = state;

  return (
    <main className="login-container">
      <div className="login-visual">
        <Image
          src="https://i.pinimg.com/736x/88/91/ac/8891acbe63e7f399f12c3ae68bf1a3d5.jpg"
          alt="Menininha lendo um livro na biblioteca"
          fill
          priority
          unoptimized
          sizes="50vw"
          className="login-background-image"
        />
      </div>

      <section className="login-side">
        <Image
          src="https://i.pinimg.com/736x/a1/7f/e2/a17fe21094b6946a47fa78e122988dda.jpg"
          alt=""
          fill
          priority
          unoptimized
          sizes="50vw"
          className="login-background-image"
        />
        <div className="login-panel">
          <h1>Login</h1>
          <h2>Entrar na plataforma</h2>
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
        </div>
      </section>
    </main>
  );
}
