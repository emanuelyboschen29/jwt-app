import Link from "next/link";
import { requireAnyRole } from "@/lib/auth";

import "../../cadastro-form.css";

export const instant = false;

export default async function NovoLivroPage() {
  await requireAnyRole(["admin", "librarian"]);

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

      <section className="cadastro-form" aria-labelledby="novo-livro-titulo">
        <h2 id="novo-livro-titulo">Dados do livro</h2>

        <div className="cadastro-fields">
          <label className="cadastro-field cadastro-field--wide">
            Título
            <input name="titulo" type="text" required />
          </label>

          <label className="cadastro-field">
            Autor
            <input name="autor" type="text" required />
          </label>

          <label className="cadastro-field">
            ISBN
            <input name="isbn" type="text" />
          </label>

          <label className="cadastro-field">
            Editora
            <input name="editora" type="text" />
          </label>

          <label className="cadastro-field">
            Ano de publicação
            <input name="anoPublicacao" type="number" min="0" max="2100" />
          </label>

          <label className="cadastro-field">
            Gênero
            <input name="genero" type="text" />
          </label>

          <label className="cadastro-field">
            Quantidade
            <input name="quantidade" type="number" min="0" defaultValue="1" />
          </label>
        </div>

        <p className="cadastro-notice">
          O salvamento será habilitado quando a integração de cadastro estiver disponível.
        </p>

        <div className="cadastro-actions">
          <Link href="/dashboard/livros" className="cadastro-cancel">
            Cancelar
          </Link>
          <button className="cadastro-submit" type="button" disabled>
            Salvar livro
          </button>
        </div>
      </section>
    </main>
  );
}
