export default function LivrosPage() {
  return (
    <main className="livros-container">
      <header className="livros-header">
        <div>
          <span>Biblioteca</span>
          <h1>Livros</h1>
          <p>Gerencie o acervo da biblioteca.</p>
        </div>

        <button className="btn-novo-livro">
          + Novo livro
        </button>
      </header>

      <section className="livros-filtros">
        <input
          type="text"
          placeholder="Buscar livro pelo título..."
        />
      </section>

      <section className="livros-lista">
        <h2>Acervo de livros</h2>

        {/* Aqui entrará a tabela de livros */}
      </section>
    </main>
  );
}