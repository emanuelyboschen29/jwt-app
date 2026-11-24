import Link from "next/link";
import { requireAnyRole } from "@/lib/auth";
import "./emprestimo.css";

export const instant = false;

export default async function EmprestimosPage() {
  await requireAnyRole(["admin", "librarian"]);

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

      <section className="emprestimo-stats">
        <div className="emprestimo-stat-card">
          <span>Empréstimos ativos</span>
          <h3>--</h3>
        </div>

        <div className="emprestimo-stat-card">
          <span>Em atraso</span>
          <h3>--</h3>
        </div>

        <div className="emprestimo-stat-card">
          <span>Devolvidos</span>
          <h3>--</h3>
        </div>
      </section>

      <section className="emprestimo-filtros">
        <input
          className="emprestimo-search"
          type="text"
          placeholder="Buscar empréstimo..."
        />
      </section>

      <section className="emprestimo-card">
        <div className="emprestimo-card-header">
          <h2>Registro de empréstimos</h2>
          <p>Consulte os empréstimos e suas situações.</p>
        </div>

        <div className="emprestimo-tabela-container">
          <table className="emprestimo-tabela">
            <thead>
              <tr>
                <th>Livro</th>
                <th>Leitor</th>
                <th>Data empréstimo</th>
                <th>Data devolução</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colSpan={6} className="emprestimo-vazio">
                  Os empréstimos serão carregados aqui.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}