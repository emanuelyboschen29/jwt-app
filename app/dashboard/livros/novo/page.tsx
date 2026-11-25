import Link from "next/link";
import { requireAnyRole } from "@/lib/auth";
import { apiErrorMessage, libraryApi } from "@/lib/library-api";
import type { Author, Category } from "@/lib/library-types";
import { BookForm } from "../../entity-forms";

import "../../cadastro-form.css";

export const instant = false;

export default async function NovoLivroPage() {
  await requireAnyRole(["admin"]);
  let categories: Category[] = [];
  let authors: Author[] = [];
  let error: string | null = null;

  try {
    [categories, authors] = await Promise.all([
      libraryApi<Category[]>("/categories"),
      libraryApi<Author[]>("/authors"),
    ]);
  } catch (requestError) {
    error = apiErrorMessage(requestError);
  }

  return (
    <main className="cadastro-page">
      <Link href="/dashboard/livros" className="cadastro-back">
        ← Voltar para livros
      </Link>

      <header className="cadastro-heading">
        <span>Biblioteca / Livros</span>
        <h1>Novo livro</h1>
        <p>Preencha os dados para adicionar um livro ao acervo.</p>
      </header>

      {error
        ? <p className="form-error" role="alert">{error}</p>
        : <BookForm categories={categories} authors={authors} />}
    </main>
  );
}
