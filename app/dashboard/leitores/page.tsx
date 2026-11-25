import Link from "next/link";
import { requireAnyRole } from "@/lib/auth";
import { apiErrorMessage, libraryApi } from "@/lib/library-api";
import type { Reader } from "@/lib/library-types";
import ReaderList from "./reader-list";
import "./leitores.css";

export const instant = false;

export default async function LeitoresPage() {
  await requireAnyRole(["admin", "librarian"]);
  let readers: Reader[] = [];
  let error: string | null = null;
  try {
    readers = await libraryApi<Reader[]>("/readers");
  } catch (requestError) {
    error = apiErrorMessage(requestError);
  }

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

      {error ? <p className="leitores-error" role="alert">{error}</p> : <ReaderList readers={readers} />}
    </main>
  );
}