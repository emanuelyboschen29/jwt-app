"use client";

import { useState } from "react";
import type { Reader } from "@/lib/library-types";

export default function ReaderList({ readers }: { readers: Reader[] }) {
  const [query, setQuery] = useState("");
  const filtered = readers.filter((reader) => (
    `${reader.name} ${reader.cpf} ${reader.email ?? ""}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())
  ));

  return (
    <>
      <section className="leitores-filtros">
        <input
          type="search"
          placeholder="Buscar por nome, CPF ou e-mail..."
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
      </section>
      <section className="leitores-card">
        <div className="leitores-card-titulo">
          <h2>Leitores cadastrados</h2>
          <p>Consulte os dados dos leitores da biblioteca.</p>
        </div>
        <div className="leitores-tabela-container">
          <table className="leitores-tabela">
            <thead>
              <tr><th>Nome</th><th>CPF</th><th>E-mail</th><th>Telefone</th></tr>
            </thead>
            <tbody>
              {filtered.map((reader) => (
                <tr key={reader.id}>
                  <td>{reader.name}</td>
                  <td>{reader.cpf}</td>
                  <td>{reader.email || "—"}</td>
                  <td>{reader.phone || "—"}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="leitores-vazio">
                  {readers.length === 0 ? "Nenhum leitor cadastrado." : "Nenhum leitor corresponde à busca."}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
