import Link from 'next/link';
import { requireUser } from '@/lib/auth';

export const instant = false;

const indicators = [
  { label: 'Total de livros', value: '120', icon: 'livros', tone: 'blue' },
  { label: 'Emprestimos ativos', value: '18', icon: 'emprestimos', tone: 'green' },
  { label: 'Atrasados', value: '3', icon: 'atrasados', tone: 'orange' },
  { label: 'Multas pendentes', value: 'R$ 45,00', icon: 'multas', tone: 'purple' },
];

const recentLoans = [
  { book: 'Dom Casmurro', reader: 'Ana Silva', date: '20/11/2026', status: 'Ativo' },
  { book: 'O Cortico', reader: 'Lucas Santos', date: '18/11/2026', status: 'Ativo' },
  { book: 'A Hora da Estrela', reader: 'Mariana Costa', date: '10/11/2026', status: 'Atrasado' },
  { book: 'Memorias Postumas', reader: 'Pedro Lima', date: '08/11/2026', status: 'Devolvido' },
];

export default async function Dashboard() {
  await requireUser();

  return (
    <main className="dashboard-home">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Visao geral</p>
          <h1>Dashboard</h1>
        </div>
        <button className="notification-button" type="button" aria-label="Notificacoes">
          ♢
          <span className="notification-dot" />
        </button>
      </header>

      <section className="dashboard-cards" aria-label="Indicadores da biblioteca">
        {indicators.map((item) => (
          <article className="dashboard-card" key={item.label}>
            <div className={`card-icon ${item.tone}`} aria-hidden="true">
              {item.icon === 'livros' && '▤'}
              {item.icon === 'emprestimos' && '↔'}
              {item.icon === 'atrasados' && '!'}
              {item.icon === 'multas' && 'R$'}
            </div>
            <div>
              <p>{item.label}</p>
              <strong>{item.value}</strong>
            </div>
          </article>
        ))}
      </section>

      <section className="dashboard-panel">
        <div className="panel-header">
          <div>
            <h2>Emprestimos recentes</h2>
            <p>Ultimas movimentacoes da biblioteca</p>
          </div>
          <Link href="/dashboard/emprestimo">Ver todos</Link>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Livro</th>
                <th>Leitor</th>
                <th>Data</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentLoans.map((loan) => (
                <tr key={`${loan.book}-${loan.reader}`}>
                  <td><strong>{loan.book}</strong></td>
                  <td>{loan.reader}</td>
                  <td>{loan.date}</td>
                  <td>
                    <span className={`status ${loan.status.toLowerCase()}`}>
                      {loan.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
