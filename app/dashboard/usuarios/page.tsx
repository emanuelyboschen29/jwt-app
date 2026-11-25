import { requireAnyRole, listUsersForAdmin } from "@/lib/auth";
import AttendantForm from "./attendant-form";
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
          <p>Cadastre atendentes e gerencie as permissões das contas.</p>
        </div>
      </header>

      <AttendantForm />

      <section className="usuarios-card" aria-labelledby="usuarios-titulo">
        <div className="usuarios-card-header">
          <h2 id="usuarios-titulo">Contas cadastradas</h2>
          <p>As contas são classificadas como Administrador ou Atendente.</p>
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
          Administradores gerenciam os atendentes e a biblioteca. Atendentes cadastram
          leitores, registram empréstimos e consultam o acervo.
        </p>
      </section>
    </main>
  );
}
