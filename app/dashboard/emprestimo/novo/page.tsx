import Link from "next/link";
import { requireAnyRole } from "@/lib/auth";

import "../../cadastro-form.css";

export const instant = false;

export default async function NovoEmprestimoPage() {
  await requireAnyRole(["admin", "librarian"]);

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

      <section className="cadastro-form" aria-labelledby="novo-emprestimo-titulo">
        <h2 id="novo-emprestimo-titulo">Dados do empréstimo</h2>

        <div className="cadastro-fields">
          <label className="cadastro-field">
            Livro
            <input
              name="livro"
              type="text"
              placeholder="Título do livro"
              required
            />
          </label>

          <label className="cadastro-field">
            Leitor
            <input
              name="leitor"
              type="text"
              placeholder="Nome do leitor"
              required
            />
          </label>

          <label className="cadastro-field">
            Data do empréstimo
            <input name="dataEmprestimo" type="date" required />
          </label>

          <label className="cadastro-field">
            Devolução prevista
            <input name="dataDevolucao" type="date" required />
          </label>
        </div>

        <p className="cadastro-notice">
          O salvamento será habilitado quando a integração de cadastro estiver disponível.
        </p>

        <div className="cadastro-actions">
          <Link href="/dashboard/emprestimo" className="cadastro-cancel">
            Cancelar
          </Link>
          <button className="cadastro-submit" type="button" disabled>
            Salvar empréstimo
          </button>
        </div>
      </section>
    </main>
  );
}
