"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/logout";
import { USER_ROLE_LABELS, type UserRole } from "@/lib/roles";

const navigation: {
  href: string;
  label: string;
  icon: string;
  roles?: readonly UserRole[];
}[] = [
  { href: "/dashboard", label: "Dashboard", icon: "▦", roles: ["admin"] },
  { href: "/dashboard/livros", label: "Livros", icon: "▤", roles: ["admin", "librarian"] },
  { href: "/dashboard/categorias", label: "Categorias", icon: "C", roles: ["admin"] },
  { href: "/dashboard/autores", label: "Autores", icon: "A", roles: ["admin"] },
  { href: "/dashboard/leitores", label: "Leitores", icon: "◉", roles: ["admin", "librarian"] },
  { href: "/dashboard/emprestimo", label: "Empréstimos", icon: "↔", roles: ["admin", "librarian"] },
  { href: "/dashboard/usuarios", label: "Usuários", icon: "U", roles: ["admin"] },
];

export default function DashboardSidebar({
  name,
  role,
}: {
  name: string;
  role: UserRole;
}) {
  const pathname = usePathname();
  const homeHref = role === "admin" ? "/dashboard" : "/dashboard/livros";

  return (
    <aside className="dashboard-sidebar">
      <Link href={homeHref} className="dashboard-brand" aria-label="Ir para a página inicial">
        <span className="brand-mark">B</span>
        <span>Biblioteca</span>
      </Link>

      <nav className="dashboard-nav" aria-label="Menu principal">
        {navigation
          .filter((item) => !item.roles || item.roles.includes(role))
          .map((item) => {
          const isActive = item.href === "/dashboard"
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              className={`nav-item${isActive ? " active" : ""}`}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              {item.label}
            </Link>
          );
          })}
      </nav>

      <div className="dashboard-user">
        <span className="user-avatar">A</span>
        <div>
          <strong>{name}</strong>
          <small>{USER_ROLE_LABELS[role]}</small>
        </div>
      </div>

      <form action={logout} className="dashboard-logout">
        <button type="submit">Sair</button>
      </form>
    </aside>
  );
}
