"use client";

import { useActionState } from "react";
import {
  createAuthor,
  createBook,
  createCategory,
  createLoan,
  createReader,
  returnLoan,
  type EntityFormState,
} from "@/actions/library";
import type { Author, Book, Category, Reader } from "@/lib/library-types";

const initialState: EntityFormState = { error: null, success: null };

function Feedback({ state }: { state: EntityFormState }) {
  return (
    <>
      {state.error && <p className="cadastro-notice form-error" role="alert">{state.error}</p>}
      {state.success && <p className="cadastro-notice form-success" role="status">{state.success}</p>}
    </>
  );
}

export function CategoryForm() {
  const [state, formAction, pending] = useActionState(createCategory, initialState);

  return (
    <form action={formAction} className="cadastro-form">
      <div className="cadastro-fields">
        <label className="cadastro-field">
          Nome
          <input name="name" type="text" minLength={2} maxLength={120} required />
        </label>
        <label className="cadastro-field">
          Descrição
          <input name="description" type="text" maxLength={500} />
        </label>
      </div>
      <Feedback state={state} />
      <div className="cadastro-actions">
        <button className="cadastro-submit" type="submit" disabled={pending}>
          {pending ? "Salvando..." : "Cadastrar categoria"}
        </button>
      </div>
    </form>
  );
}

export function AuthorForm() {
  const [state, formAction, pending] = useActionState(createAuthor, initialState);

  return (
    <form action={formAction} className="cadastro-form">
      <div className="cadastro-fields">
        <label className="cadastro-field">
          Nome
          <input name="name" type="text" minLength={2} maxLength={120} required />
        </label>
        <label className="cadastro-field">
          Nacionalidade
          <input name="nationality" type="text" maxLength={100} />
        </label>
        <label className="cadastro-field">
          Data de nascimento
          <input name="birthDate" type="date" />
        </label>
      </div>
      <Feedback state={state} />
      <div className="cadastro-actions">
        <button className="cadastro-submit" type="submit" disabled={pending}>
          {pending ? "Salvando..." : "Cadastrar autor"}
        </button>
      </div>
    </form>
  );
}

export function BookForm({
  categories,
  authors,
}: {
  categories: Category[];
  authors: Author[];
}) {
  const [state, formAction, pending] = useActionState(createBook, initialState);

  return (
    <form action={formAction} className="cadastro-form">
      <div className="cadastro-fields">
        <label className="cadastro-field cadastro-field--wide">
          Título
          <input name="title" type="text" maxLength={200} required />
        </label>
        <label className="cadastro-field">
          ISBN
          <input name="isbn" type="text" maxLength={30} required />
        </label>
        <label className="cadastro-field">
          Ano
          <input name="year" type="number" min={0} max={2100} />
        </label>
        <label className="cadastro-field">
          Total de exemplares
          <input name="totalCopies" type="number" min={1} defaultValue={1} required />
        </label>
        <label className="cadastro-field">
          Categoria
          <select name="categoryId" required defaultValue="">
            <option value="" disabled>Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>
        <fieldset className="cadastro-field cadastro-field--wide cadastro-checkboxes">
          <legend>Autores</legend>
          {authors.map((author) => (
            <label key={author.id}>
              <input name="authorIds" type="checkbox" value={author.id} />
              {author.name}
            </label>
          ))}
          {authors.length === 0 && <p>Cadastre autores antes de incluir um livro.</p>}
        </fieldset>
      </div>
      <Feedback state={state} />
      <div className="cadastro-actions">
        <button
          className="cadastro-submit"
          type="submit"
          disabled={pending || categories.length === 0 || authors.length === 0}
        >
          {pending ? "Salvando..." : "Cadastrar livro"}
        </button>
      </div>
    </form>
  );
}

export function ReaderForm() {
  const [state, formAction, pending] = useActionState(createReader, initialState);

  return (
    <form action={formAction} className="cadastro-form">
      <div className="cadastro-fields">
        <label className="cadastro-field cadastro-field--wide">
          Nome completo
          <input name="name" type="text" autoComplete="name" minLength={2} maxLength={120} required />
        </label>
        <label className="cadastro-field">
          CPF
          <input name="cpf" type="text" inputMode="numeric" placeholder="000.000.000-00" required />
        </label>
        <label className="cadastro-field">
          E-mail
          <input name="email" type="email" autoComplete="email" maxLength={254} />
        </label>
        <label className="cadastro-field">
          Telefone
          <input name="phone" type="tel" autoComplete="tel" maxLength={30} />
        </label>
      </div>
      <Feedback state={state} />
      <div className="cadastro-actions">
        <button className="cadastro-submit" type="submit" disabled={pending}>
          {pending ? "Salvando..." : "Cadastrar leitor"}
        </button>
      </div>
    </form>
  );
}

export function LoanForm({
  books,
  readers,
}: {
  books: Book[];
  readers: Reader[];
}) {
  const [state, formAction, pending] = useActionState(createLoan, initialState);
  const availableBooks = books.filter((book) => book.availableCopies > 0);

  return (
    <form action={formAction} className="cadastro-form">
      <div className="cadastro-fields">
        <label className="cadastro-field">
          Livro
          <select name="bookId" required defaultValue="">
            <option value="" disabled>Selecione um livro</option>
            {availableBooks.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} ({book.availableCopies} disponível(is))
              </option>
            ))}
          </select>
        </label>
        <label className="cadastro-field">
          Leitor
          <select name="readerId" required defaultValue="">
            <option value="" disabled>Selecione um leitor</option>
            {readers.map((reader) => (
              <option key={reader.id} value={reader.id}>{reader.name}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="cadastro-notice">O prazo de devolução é calculado pela API (7 dias).</p>
      <Feedback state={state} />
      <div className="cadastro-actions">
        <button
          className="cadastro-submit"
          type="submit"
          disabled={pending || availableBooks.length === 0 || readers.length === 0}
        >
          {pending ? "Registrando..." : "Registrar empréstimo"}
        </button>
      </div>
    </form>
  );
}

export function ReturnLoanForm({ loanId }: { loanId: number }) {
  const [state, formAction, pending] = useActionState(returnLoan, initialState);

  return (
    <form action={formAction}>
      <input type="hidden" name="loanId" value={loanId} />
      <button type="submit" disabled={pending}>
        {pending ? "Registrando..." : "Registrar devolução"}
      </button>
      <Feedback state={state} />
    </form>
  );
}
