import { requireAnyRole, listUsersForAdmin } from "@/lib/auth";
import RoleEditor from "./role-editor";
import "./usuarios.css";

export const instant = false;

export default async function UsuariosPage() {
  const admin = await requireAnyRole(["admin"]);
  const users = await listUsersForAdmin();

  return (
    <main className="usuarios-page">
      <header className="usuarios-header">
        <div>
          <span>Administração</span>
          <h1>Usuários e permissões</h1>
          <p>Consulte as contas e atribua um papel para cada usuário.</p>
        </div>
      </header>

      <section className="usuarios-card" aria-labelledby="usuarios-titulo">
        <div className="usuarios-card-header">
          <h2 id="usuarios-titulo">Contas cadastradas</h2>
          <p>Novas contas públicas recebem automaticamente o papel Leitor.</p>
        </div>

        <div className="usuarios-table-wrapper">
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Cadastro</th>
                <th>Papel</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString("pt-BR")}</td>
                  <td>
                    <RoleEditor
                      userId={user.id}
                      currentUserId={admin.id}
                      role={user.role}
                    />
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="usuarios-empty">
                    Nenhum usuário cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="usuarios-role-legend">
          Papéis: Administrador (gerencia usuários), Bibliotecário (gerencia o acervo)
          e Leitor (acesso ao painel).
        </p>
      </section>
    </main>
  );
}
