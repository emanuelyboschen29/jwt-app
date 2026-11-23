import "./leitores.css";

export default function LeitoresPage() {
  return (
    <main className="leitores">
      <header className="cabecalho">
        <div>
          <span className="subtitulo">Biblioteca</span>
          <h1>Leitores</h1>
          <p>Gerencie os leitores cadastrados.</p>
        </div>

        <button className="botao">
          + Novo leitor
        </button>
      </header>

      <section className="filtros">
        <input
          type="text"
          placeholder="Buscar leitor pelo nome..."
        />
      </section>

      <section className="card">
        <div className="card-titulo">
          <h2>Leitores cadastrados</h2>
          <p>Consulte e gerencie os leitores da biblioteca.</p>
        </div>

        <div className="tabela-container">
          <table className="tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Dados do leitor</th>
                <th>Cadastro</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colSpan={5} className="vazio">
                  Nenhum leitor carregado.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}