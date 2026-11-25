import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { apiErrorMessage, libraryApi } from '@/lib/library-api';
import type { DashboardReport, Loan } from '@/lib/library-types';

export const instant = false;

const currency = (value: number) => Number(value).toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const dateLabel = (value: string) => new Date(`${value.slice(0, 10)}T12:00:00`).toLocaleDateString('pt-BR');

export default async function Dashboard() {
  const user = await requireUser();
  if (user.role !== 'admin') {
    redirect('/dashboard/livros');
  }

  let report: DashboardReport | null = null;
  let loans: Loan[] = [];
  let error: string | null = null;
  try {
    [report, loans] = await Promise.all([
      libraryApi<DashboardReport>('/reports/dashboard'),
      libraryApi<Loan[]>('/loans'),
    ]);
  } catch (requestError) {
    error = apiErrorMessage(requestError);
  }
  const indicators = report ? [
    { label: 'Total de livros', value: String(report.totalBooks), icon: 'livros', tone: 'blue' },
    { label: 'Empréstimos ativos', value: String(report.activeLoans), icon: 'emprestimos', tone: 'green' },
    { label: 'Atrasados', value: String(report.overdueLoans), icon: 'atrasados', tone: 'orange' },
    { label: 'Multas pendentes', value: currency(report.pendingFines), icon: 'multas', tone: 'purple' },
  ] : [];
  const recentLoans = [...loans]
    .sort((a, b) => new Date(b.loanDate).getTime() - new Date(a.loanDate).getTime())
    .slice(0, 5);

  return (
    <main className="dashboard-home">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Visão geral</p>
          <h1>Dashboard</h1>
        </div>
        <button className="notification-button" type="button" aria-label="Notificações">
          ♢
          <span className="notification-dot" />
        </button>
      </header>

      {error ? <p className="dashboard-error" role="alert">{error}</p> : (
        <>
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
                <h2>Empréstimos recentes</h2>
                <p>Últimas movimentações da biblioteca</p>
              </div>
              <Link href="/dashboard/emprestimo">Ver todos</Link>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Livro</th><th>Leitor</th><th>Data</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {recentLoans.map((loan) => {
                    const status = loan.status === 'DEVOLVIDO'
                      ? 'Devolvido'
                      : loan.status === 'ATRASADO' ? 'Atrasado' : 'Ativo';
                    return (
                      <tr key={loan.id}>
                        <td><strong>{(loan.Book ?? loan.book)?.title ?? `Livro #${loan.bookId}`}</strong></td>
                        <td>{(loan.Reader ?? loan.reader)?.name ?? `Leitor #${loan.readerId}`}</td>
                        <td>{dateLabel(loan.loanDate)}</td>
                        <td><span className={`status ${status.toLocaleLowerCase()}`}>{status}</span></td>
                      </tr>
                    );
                  })}
                  {recentLoans.length === 0 && (
                    <tr><td colSpan={4}>Ainda não há empréstimos para mostrar.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
