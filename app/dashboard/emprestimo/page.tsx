import Link from "next/link";
import { requireAnyRole } from "@/lib/auth";
import { apiErrorMessage, libraryApi } from "@/lib/library-api";
import type { Loan } from "@/lib/library-types";
import LoanList from "./loan-list";
import "./emprestimo.css";

export const instant = false;

export default async function EmprestimosPage() {
  await requireAnyRole(["admin", "librarian"]);
  let loans: Loan[] = [];
  let error: string | null = null;
  try {
    loans = await libraryApi<Loan[]>("/loans");
  } catch (requestError) {
    error = apiErrorMessage(requestError);
  }

  return (
    <main className="emprestimo-container">
      <Link href="/dashboard" className="emprestimo-voltar">
        ← Voltar ao dashboard
      </Link>

      <header className="emprestimo-header">
        <div>
          <span>Biblioteca</span>
          <h1>Empréstimos</h1>
          <p>Controle os empréstimos e as devoluções de livros.</p>
        </div>

        <Link href="/dashboard/emprestimo/novo" className="emprestimo-button">
          + Novo empréstimo
        </Link>
      </header>

      {error ? <p className="emprestimo-error" role="alert">{error}</p> : <LoanList loans={loans} />}
    </main>
  );
}