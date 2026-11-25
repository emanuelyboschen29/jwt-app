import { requireAnyRole } from "@/lib/auth";
import { apiErrorMessage, libraryApi } from "@/lib/library-api";
import type { Category } from "@/lib/library-types";
import { CategoryForm } from "../entity-forms";
import "../entities.css";
import "../cadastro-form.css";

export const instant = false;

export default async function CategoriesPage() {
  await requireAnyRole(["admin"]);
  let categories: Category[] = [];
  let error: string | null = null;
  try {
    categories = await libraryApi<Category[]>("/categories");
  } catch (requestError) {
    error = apiErrorMessage(requestError);
  }

  return (
    <main className="entity-page">
      <header className="entity-header">
        <span>Administração</span>
        <h1>Categorias</h1>
        <p>Cadastre e consulte as categorias associadas aos livros.</p>
      </header>
      <CategoryForm />
      <section className="entity-card">
        <h2>Categorias cadastradas</h2>
        {error ? <p className="entity-error" role="alert">{error}</p> : (
          <div className="entity-table-wrap">
            <table className="entity-table">
              <thead><tr><th>Nome</th><th>Descrição</th></tr></thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}><td>{category.name}</td><td>{category.description || "—"}</td></tr>
                ))}
                {categories.length === 0 && <tr><td className="entity-empty" colSpan={2}>Nenhuma categoria cadastrada.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
