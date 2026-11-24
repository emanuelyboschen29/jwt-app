import Link from "next/link";
import { requireAnyRole } from "@/lib/auth";

import "../../cadastro-form.css";

export const instant = false;

export default async function NovoLeitorPage() {
  await requireAnyRole(["admin", "librarian"]);

  return (
    <main className="cadastro-page">
      <Link href="/dashboard/leitores" className="cadastro-back">
        ← Voltar para leitores
      </Link>

      <header className="cadastro-heading">
        <span>Biblioteca / Leitores</span>
        <h1>Novo leitor</h1>
        <p>Preencha os dados para cadastrar um leitor.</p>
      </header>

      <section className="cadastro-form" aria-labelledby="novo-leitor-titulo">
        <h2 id="novo-leitor-titulo">Dados do leitor</h2>

        <div className="cadastro-fields">
          <label className="cadastro-field cadastro-field--wide">
            Nome completo
            <input name="nome" type="text" autoComplete="name" required />
          </label>

          <label className="cadastro-field">
            E-mail
            <input name="email" type="email" autoComplete="email" required />
          </label>

          <label className="cadastro-field">
            Telefone
            <input name="telefone" type="tel" autoComplete="tel" />
          </label>

          <label className="cadastro-field cadastro-field--wide">
            Endereço
            <input name="endereco" type="text" autoComplete="street-address" />
          </label>
        </div>

        <p className="cadastro-notice">
          O salvamento será habilitado quando a integração de cadastro estiver disponível.
        </p>

        <div className="cadastro-actions">
          <Link href="/dashboard/leitores" className="cadastro-cancel">
            Cancelar
          </Link>
          <button className="cadastro-submit" type="button" disabled>
            Salvar leitor
          </button>
        </div>
      </section>
    </main>
  );
}
