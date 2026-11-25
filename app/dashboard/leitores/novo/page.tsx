import Link from "next/link";
import { requireAnyRole } from "@/lib/auth";
import { ReaderForm } from "../../entity-forms";

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

      <ReaderForm />
    </main>
  );
}
