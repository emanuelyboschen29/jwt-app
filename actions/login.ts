'use server';

import { isAxiosError } from 'axios';
import publicApi from '@/lib/api';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';


export async function login(
    _prevState: { error: string | null },
    formData: FormData,
): Promise<{ error: string | null }> {
  const email = formData.get('email')?.toString().trim();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
      return { error: 'Informe o e-mail e a senha.' };
  }

    try {
    const res = await publicApi.post(`/auth/login`, {
        email,
        password
    });
    
    const token = res.data?.token
        ?? res.data?.accessToken
        ?? res.data?.access_token;

    if (!token) {
        return { error: 'A API autenticou, mas não retornou um token.' };
    }

    const cookieStore = await cookies();          // ← await no Next 15/16
    cookieStore.set('token', token, {
        httpOnly: true,                             // ← JS não lê o token
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 15,                            // ← 15 minutos (exp curto)
    });

  
    }catch (error: unknown) {
        console.error('Login error:', error);

        if (isAxiosError(error)) {
            if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
                return {
                    error: 'API indisponível. Inicie o servidor em http://localhost:3000.',
                };
            }

            const responseMessage = error.response?.data?.message;
            const message = Array.isArray(responseMessage)
                ? responseMessage.join(', ')
                : typeof responseMessage === 'string'
                    ? responseMessage
                    : undefined;

            return {
                error: message || `Erro ${error.response?.status ?? 'desconhecido'} ao fazer login`,
            };
        }

        return {
            error: 'Erro ao fazer login',
        };
    }

      redirect('/dashboard');
}