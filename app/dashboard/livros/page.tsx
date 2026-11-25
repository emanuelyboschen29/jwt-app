import Link from "next/link";
import { requireAnyRole } from "@/lib/auth";
import { libraryApi, apiErrorMessage } from "@/lib/library-api";
import type { Author, Book, Category } from "@/lib/library-types";
import BookList from "./book-list";
import "./livros.css";

export const instant = false;

export default async function LivrosPage() {
  const user = await requireAnyRole(["admin", "librarian"]);
  let books: Book[] = [];
  let categories: Category[] = [];
  let authors: Author[] = [];
  let error: string | null = null;

  try {
    [books, categories, authors] = await Promise.all([
      libraryApi<Book[]>("/books"),
      libraryApi<Category[]>("/categories"),
      libraryApi<Author[]>("/authors"),
    ]);
  } catch (requestError) {
    error = apiErrorMessage(requestError);
  }

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

        {user.role === "admin" && (
          <Link href="/dashboard/livros/novo" className="livros-button">+ Novo livro</Link>
        )}
      </header>

      {error
        ? <p className="livros-error" role="alert">{error}</p>
        : <BookList books={books} categories={categories} authors={authors} />}
    </main>
  );
}