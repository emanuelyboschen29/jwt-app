"use client";

import { useMemo, useState } from "react";
import type { Author, Book, Category } from "@/lib/library-types";

export default function BookList({
  books,
  categories,
  authors,
}: {
  books: Book[];
  categories: Category[];
  authors: Author[];
}) {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);

  const filteredBooks = useMemo(() => books.filter((book) => {
    const bookAuthors = book.Authors ?? book.authors ?? [];
    const matchesTitle = book.title.toLocaleLowerCase().includes(title.toLocaleLowerCase());
    const matchesCategory = !categoryId || String(book.categoryId) === categoryId
      || String(book.Category?.id ?? book.category?.id) === categoryId;
    const matchesAuthor = !authorId || bookAuthors.some((author) => String(author.id) === authorId);
    const matchesAvailability = !availableOnly || book.availableCopies > 0;
    return matchesTitle && matchesCategory && matchesAuthor && matchesAvailability;
  }), [books, title, categoryId, authorId, availableOnly]);

  return (
    <>
      <section className="livros-filtros" aria-label="Filtros do acervo">
        <input
          type="search"
          placeholder="Buscar livro pelo título..."
          value={title}
          onChange={(event) => setTitle(event.currentTarget.value)}
        />
        <select aria-label="Filtrar por categoria" value={categoryId} onChange={(event) => setCategoryId(event.currentTarget.value)}>
          <option value="">Todas as categorias</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
        <select aria-label="Filtrar por autor" value={authorId} onChange={(event) => setAuthorId(event.currentTarget.value)}>
          <option value="">Todos os autores</option>
          {authors.map((author) => <option key={author.id} value={author.id}>{author.name}</option>)}
        </select>
        <label>
          <input type="checkbox" checked={availableOnly} onChange={(event) => setAvailableOnly(event.currentTarget.checked)} />
          Disponíveis
        </label>
      </section>

      <section className="livros-lista">
        <h2>Acervo de livros</h2>
        <div className="livros-table-wrapper">
          <table className="livros-tabela">
            <thead>
              <tr><th>Título</th><th>ISBN</th><th>Ano</th><th>Categoria</th><th>Autores</th><th>Exemplares</th></tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => {
                const bookAuthors = book.Authors ?? book.authors ?? [];
                return (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.isbn}</td>
                    <td>{book.year ?? "—"}</td>
                    <td>{(book.Category ?? book.category)?.name ?? "—"}</td>
                    <td>{bookAuthors.map((author) => author.name).join(", ") || "—"}</td>
                    <td>{book.availableCopies} / {book.totalCopies}</td>
                  </tr>
                );
              })}
              {filteredBooks.length === 0 && (
                <tr><td colSpan={6} className="livros-vazio">Nenhum livro corresponde aos filtros.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
