export default function EmprestimosPage() {
  return (
    <main className="page-container">
      <header className="page-header">
        <div>
          <span>Biblioteca</span>
          <h1>Empréstimos</h1>
          <p>Controle os empréstimos e as devoluções de livros.</p>
        </div>

        <button className="page-button">
          + Novo empréstimo
        </button>
      </header>

      <section className="page-stats">
        <div className="page-stat-card">
          <span>Empréstimos ativos</span>
          <h3>--</h3>
        </div>

        <div className="page-stat-card">
          <span>Em atraso</span>
          <h3>--</h3>
        </div>

        <div className="page-stat-card">
          <span>Devolvidos</span>
          <h3>--</h3>
        </div>
      </section>

      <section className="page-filters">
        <input
          className="page-search"
          type="text"
          placeholder="Buscar empréstimo..."
        />
      </section>

      <section className="page-card">
        <div className="page-card-header">
          <h2>Registro de empréstimos</h2>
          <p>Consulte os empréstimos e suas situações.</p>
        </div>

        <div className="page-table-wrapper">
          <table className="page-table">
            <thead>
              <tr>
                <th>Livro</th>
                <th>Leitor</th>
                <th>Data empréstimo</th>
                <th>Data devolução</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colSpan={6} className="page-empty">
                  Os empréstimos serão carregados aqui.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}