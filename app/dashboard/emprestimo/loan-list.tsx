"use client";

import { useMemo, useState } from "react";
import type { Loan } from "@/lib/library-types";
import { ReturnLoanForm } from "../entity-forms";

const statusNames: Record<Loan["status"], string> = {
  ATIVO: "Ativo",
  ATRASADO: "Atrasado",
  DEVOLVIDO: "Devolvido",
};

function dateLabel(value: string | null) {
  return value ? new Date(`${value.slice(0, 10)}T12:00:00`).toLocaleDateString("pt-BR") : "—";
}

export default function LoanList({ loans }: { loans: Loan[] }) {
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => loans.filter((loan) => {
    const book = loan.Book ?? loan.book;
    const reader = loan.Reader ?? loan.reader;
    const text = `${book?.title ?? ""} ${reader?.name ?? ""}`.toLocaleLowerCase();
    return (!status || loan.status === status) && text.includes(query.toLocaleLowerCase());
  }), [loans, status, query]);

  const counts = {
    active: loans.filter((loan) => loan.status === "ATIVO").length,
    overdue: loans.filter((loan) => loan.status === "ATRASADO").length,
    returned: loans.filter((loan) => loan.status === "DEVOLVIDO").length,
  };

  return (
    <>
      <section className="emprestimo-stats">
        <div className="emprestimo-stat-card"><span>Empréstimos ativos</span><h3>{counts.active}</h3></div>
        <div className="emprestimo-stat-card"><span>Em atraso</span><h3>{counts.overdue}</h3></div>
        <div className="emprestimo-stat-card"><span>Devolvidos</span><h3>{counts.returned}</h3></div>
      </section>
      <section className="emprestimo-filtros">
        <input
          className="emprestimo-search"
          type="search"
          placeholder="Buscar por livro ou leitor..."
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
        <select aria-label="Filtrar por status" value={status} onChange={(event) => setStatus(event.currentTarget.value)}>
          <option value="">Todos os status</option>
          <option value="ATIVO">Ativo</option>
          <option value="ATRASADO">Atrasado</option>
          <option value="DEVOLVIDO">Devolvido</option>
        </select>
      </section>
      <section className="emprestimo-card">
        <div className="emprestimo-card-header">
          <h2>Registro de empréstimos</h2>
          <p>Consulte os empréstimos e registre devoluções.</p>
        </div>
        <div className="emprestimo-tabela-container">
          <table className="emprestimo-tabela">
            <thead>
              <tr><th>Livro</th><th>Leitor</th><th>Empréstimo</th><th>Prevista</th><th>Devolvido</th><th>Status</th><th>Multa</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {filtered.map((loan) => (
                <tr key={loan.id}>
                  <td>{(loan.Book ?? loan.book)?.title ?? `Livro #${loan.bookId}`}</td>
                  <td>{(loan.Reader ?? loan.reader)?.name ?? `Leitor #${loan.readerId}`}</td>
                  <td>{dateLabel(loan.loanDate)}</td>
                  <td>{dateLabel(loan.dueDate)}</td>
                  <td>{dateLabel(loan.returnDate)}</td>
                  <td><span className={`status ${loan.status.toLowerCase()}`}>{statusNames[loan.status]}</span></td>
                  <td>{Number(loan.fine).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                  <td>{loan.returnDate ? "—" : <ReturnLoanForm loanId={loan.id} />}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="emprestimo-vazio">Nenhum empréstimo encontrado.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
