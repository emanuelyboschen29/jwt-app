import Link from "next/link";
import { requireAnyRole } from "@/lib/auth";
import { apiErrorMessage, libraryApi } from "@/lib/library-api";
import type { Book, Reader } from "@/lib/library-types";
import { LoanForm } from "../../entity-forms";

import "../../cadastro-form.css";

export const instant = false;

export default async function NovoEmprestimoPage() {
  await requireAnyRole(["admin", "librarian"]);
  let books: Book[] = [];
  let readers: Reader[] = [];
  let error: string | null = null;
  try {
    [books, readers] = await Promise.all([
      libraryApi<Book[]>("/books"),
      libraryApi<Reader[]>("/readers"),
    ]);
  } catch (requestError) {
    error = apiErrorMessage(requestError);
  }

  return (
    <main className="cadastro-page">
      <Link href="/dashboard/emprestimo" className="cadastro-back">
        ← Voltar para empréstimos
      </Link>

      <header className="cadastro-heading">
        <span>Biblioteca / Empréstimos</span>
        <h1>Novo empréstimo</h1>
        <p>Preencha os dados do livro, leitor e período do empréstimo.</p>
      </header>

      {error ? <p className="form-error" role="alert">{error}</p> : <LoanForm books={books} readers={readers} />}
    </main>
  );
}
