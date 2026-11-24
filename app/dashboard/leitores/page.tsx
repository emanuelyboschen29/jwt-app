import Link from "next/link";
import { requireAnyRole } from "@/lib/auth";
import "./leitores.css";

export const instant = false;

export default async function LeitoresPage() {
  await requireAnyRole(["admin", "librarian"]);

  return (
    <main className="leitores">
      <Link href="/dashboard" className="leitores-voltar">
        ← Voltar ao dashboard
      </Link>

      <header className="leitores-cabecalho">
        <div>
          <span className="leitores-subtitulo">Biblioteca</span>
          <h1>Leitores</h1>
          <p>Gerencie os leitores cadastrados.</p>
        </div>

        <Link href="/dashboard/leitores/novo" className="leitores-botao">
          + Novo leitor
        </Link>
      </header>

      <section className="leitores-filtros">
        <input
          type="text"
          placeholder="Buscar leitor pelo nome..."
        />
      </section>

      <section className="leitores-card">
        <div className="leitores-card-titulo">
          <h2>Leitores cadastrados</h2>
          <p>Consulte e gerencie os leitores da biblioteca.</p>
        </div>

        <div className="leitores-tabela-container">
          <table className="leitores-tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Dados do leitor</th>
                <th>Cadastro</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colSpan={5} className="leitores-vazio">
                  Nenhum leitor carregado.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}