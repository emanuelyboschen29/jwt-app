"use server";

import { revalidatePath } from "next/cache";
import { requireAnyRole } from "@/lib/auth";
import { apiErrorMessage, libraryApi } from "@/lib/library-api";
import type { Author, Book, Category, Loan, Reader } from "@/lib/library-types";

export type EntityFormState = {
  error: string | null;
  success: string | null;
};

function positiveInteger(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string" || !/^\d+$/.test(value)) {
    return null;
  }
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function createCategory(
  _previousState: EntityFormState,
  formData: FormData,
): Promise<EntityFormState> {
  await requireAnyRole(["admin"]);
  const name = formData.get("name")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";
  if (name.length < 2 || name.length > 120 || description.length > 500) {
    return { error: "Informe um nome válido e uma descrição de até 500 caracteres.", success: null };
  }

  try {
    await libraryApi<Category>("/categories", {
      method: "POST",
      body: JSON.stringify({ name, description }),
    });
    revalidatePath("/dashboard/categorias");
    revalidatePath("/dashboard/livros");
    return { error: null, success: "Categoria cadastrada." };
  } catch (error) {
    return { error: apiErrorMessage(error), success: null };
  }
}

export async function createAuthor(
  _previousState: EntityFormState,
  formData: FormData,
): Promise<EntityFormState> {
  await requireAnyRole(["admin"]);
  const name = formData.get("name")?.toString().trim() ?? "";
  const nationality = formData.get("nationality")?.toString().trim() ?? "";
  const birthDate = formData.get("birthDate")?.toString() ?? "";
  if (name.length < 2 || name.length > 120 || nationality.length > 100) {
    return { error: "Informe um nome válido e uma nacionalidade de até 100 caracteres.", success: null };
  }

  try {
    await libraryApi<Author>("/authors", {
      method: "POST",
      body: JSON.stringify({
        name,
        nationality: nationality || null,
        birthDate: birthDate || null,
      }),
    });
    revalidatePath("/dashboard/autores");
    revalidatePath("/dashboard/livros");
    return { error: null, success: "Autor cadastrado." };
  } catch (error) {
    return { error: apiErrorMessage(error), success: null };
  }
}

export async function createBook(
  _previousState: EntityFormState,
  formData: FormData,
): Promise<EntityFormState> {
  await requireAnyRole(["admin"]);
  const title = formData.get("title")?.toString().trim() ?? "";
  const isbn = formData.get("isbn")?.toString().trim() ?? "";
  const yearValue = formData.get("year")?.toString() ?? "";
  const totalCopies = positiveInteger(formData.get("totalCopies"));
  const categoryId = positiveInteger(formData.get("categoryId"));
  const authorIds = formData.getAll("authorIds")
    .map(positiveInteger)
    .filter((id): id is number => id !== null);
  const year = yearValue ? Number(yearValue) : null;

  if (
    title.length < 1 || title.length > 200 || isbn.length < 1 || isbn.length > 30
    || (year !== null && (!Number.isInteger(year) || year < 0 || year > 2100))
    || !totalCopies || !categoryId || authorIds.length === 0
  ) {
    return { error: "Preencha os dados do livro, a categoria, ao menos um autor e a quantidade.", success: null };
  }

  try {
    await libraryApi<Book>("/books", {
      method: "POST",
      body: JSON.stringify({
        title,
        isbn,
        year,
        totalCopies,
        availableCopies: totalCopies,
        categoryId,
        authorIds,
      }),
    });
    revalidatePath("/dashboard/livros");
    revalidatePath("/dashboard");
    return { error: null, success: "Livro cadastrado no acervo." };
  } catch (error) {
    return { error: apiErrorMessage(error), success: null };
  }
}

export async function createReader(
  _previousState: EntityFormState,
  formData: FormData,
): Promise<EntityFormState> {
  await requireAnyRole(["admin", "librarian"]);
  const name = formData.get("name")?.toString().trim() ?? "";
  const cpf = formData.get("cpf")?.toString().replace(/\D/g, "") ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";
  if (name.length < 2 || name.length > 120 || !/^\d{11}$/.test(cpf)) {
    return { error: "Informe o nome e um CPF válido com 11 dígitos.", success: null };
  }
  if (email && email.length > 254) {
    return { error: "O e-mail deve ter no máximo 254 caracteres.", success: null };
  }

  try {
    await libraryApi<Reader>("/readers", {
      method: "POST",
      body: JSON.stringify({ name, cpf, email: email || null, phone: phone || null }),
    });
    revalidatePath("/dashboard/leitores");
    return { error: null, success: "Leitor cadastrado." };
  } catch (error) {
    return { error: apiErrorMessage(error), success: null };
  }
}

export async function createLoan(
  _previousState: EntityFormState,
  formData: FormData,
): Promise<EntityFormState> {
  await requireAnyRole(["admin", "librarian"]);
  const bookId = positiveInteger(formData.get("bookId"));
  const readerId = positiveInteger(formData.get("readerId"));
  if (!bookId || !readerId) {
    return { error: "Selecione um livro e um leitor.", success: null };
  }

  try {
    await libraryApi<Loan>("/loans", {
      method: "POST",
      body: JSON.stringify({ bookId, readerId }),
    });
    revalidatePath("/dashboard/emprestimo");
    revalidatePath("/dashboard/livros");
    revalidatePath("/dashboard");
    return { error: null, success: "Empréstimo registrado. O prazo padrão é de 7 dias." };
  } catch (error) {
    return { error: apiErrorMessage(error), success: null };
  }
}

export async function returnLoan(
  _previousState: EntityFormState,
  formData: FormData,
): Promise<EntityFormState> {
  await requireAnyRole(["admin", "librarian"]);
  const loanId = positiveInteger(formData.get("loanId"));
  if (!loanId) {
    return { error: "Empréstimo inválido.", success: null };
  }

  try {
    const loan = await libraryApi<Loan>(`/loans/${loanId}/return`, { method: "PATCH" });
    revalidatePath("/dashboard/emprestimo");
    revalidatePath("/dashboard");
    const fine = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(loan.fine);
    return { error: null, success: `Devolução registrada. Multa: ${fine}.` };
  } catch (error) {
    return { error: apiErrorMessage(error), success: null };
  }
}
