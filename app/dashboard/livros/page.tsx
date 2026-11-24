import Link from "next/link";
import { requireAnyRole } from "@/lib/auth";

import "./livros.css";

export const instant = false;

export default async function LivrosPage() {
  await requireAnyRole(["admin", "librarian"]);

  return (
    <main className="livros-container">
      <Link href="/dashboard" className="livros-voltar">
        ← Voltar ao dashboard
      </Link>

      <header className="livros-header">
        <div>
          <span className="livros-subtitulo">Biblioteca</span>
          <h1>Livros</h1>
          <p>Gerencie o acervo da biblioteca.</p>
        </div>

        <Link href="/dashboard/livros/novo" className="livros-button">
          + Novo livro
        </Link>
      </header>

      <section className="livros-filtros">
        <input
          type="text"
          placeholder="Buscar livro pelo título..."
        />
      </section>

      <section className="livros-lista">
        <h2>Acervo de livros</h2>

        {/* Aqui entrará a tabela de livros */}
      </section>
    </main>
  );
}