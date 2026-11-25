import { requireAnyRole } from "@/lib/auth";
import { apiErrorMessage, libraryApi } from "@/lib/library-api";
import type { Author } from "@/lib/library-types";
import { AuthorForm } from "../entity-forms";
import "../entities.css";
import "../cadastro-form.css";

export const instant = false;

export default async function AuthorsPage() {
  await requireAnyRole(["admin"]);
  let authors: Author[] = [];
  let error: string | null = null;
  try {
    authors = await libraryApi<Author[]>("/authors");
  } catch (requestError) {
    error = apiErrorMessage(requestError);
  }

  return (
    <main className="entity-page">
      <header className="entity-header">
        <span>Administração</span>
        <h1>Autores</h1>
        <p>Cadastre e consulte autores e suas obras.</p>
      </header>
      <AuthorForm />
      <section className="entity-card">
        <h2>Autores cadastrados</h2>
        {error ? <p className="entity-error" role="alert">{error}</p> : (
          <div className="entity-table-wrap">
            <table className="entity-table">
              <thead><tr><th>Nome</th><th>Nacionalidade</th><th>Data de nascimento</th></tr></thead>
              <tbody>
                {authors.map((author) => (
                  <tr key={author.id}>
                    <td>{author.name}</td>
                    <td>{author.nationality || "—"}</td>
                    <td>{author.birthDate ? new Date(author.birthDate).toLocaleDateString("pt-BR") : "—"}</td>
                  </tr>
                ))}
                {authors.length === 0 && <tr><td className="entity-empty" colSpan={3}>Nenhum autor cadastrado.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
