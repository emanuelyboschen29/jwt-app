"use client";

import { useActionState, useState } from "react";
import { updateUserRole, type RoleFormState } from "@/actions/admin";
import { isUserRole, USER_ROLE_LABELS, USER_ROLES, type UserRole } from "@/lib/roles";

const initialState: RoleFormState = { error: null, success: null, role: null };

export default function RoleEditor({
  userId,
  currentUserId,
  role,
}: {
  userId: number;
  currentUserId: number;
  role: UserRole;
}) {
  const [state, formAction, isPending] = useActionState(updateUserRole, initialState);
  const [selectedRole, setSelectedRole] = useState(role);
  const [hasNewSelection, setHasNewSelection] = useState(false);
  const isCurrentUser = userId === currentUserId;
  const selectId = `user-role-${userId}`;
  const displayedRole = hasNewSelection ? selectedRole : state.role ?? role;

  return (
    <form action={formAction} className="usuarios-role-form">
      <input type="hidden" name="userId" value={userId} />
      <label className="visually-hidden" htmlFor={selectId}>
        Papel do usuário
      </label>
      <select
        id={selectId}
        name="role"
        value={displayedRole}
        onChange={(event) => {
          if (isUserRole(event.currentTarget.value)) {
            setSelectedRole(event.currentTarget.value);
            setHasNewSelection(true);
          }
        }}
        disabled={isCurrentUser || isPending}
        aria-label="Papel do usuário"
      >
        {USER_ROLES.map((option) => (
          <option key={option} value={option}>
            {USER_ROLE_LABELS[option]}
          </option>
        ))}
      </select>
      <button type="submit" disabled={isCurrentUser || isPending}>
        {isPending ? "Salvando..." : "Salvar"}
      </button>
      {isCurrentUser && <small>Seu próprio papel não pode ser alterado.</small>}
      {state.error && <small className="usuarios-role-error" role="alert">{state.error}</small>}
      {state.success && (
        <small className="usuarios-role-success" role="status">
          {state.role ? `Papel atualizado para ${USER_ROLE_LABELS[state.role]}.` : state.success}
        </small>
      )}
    </form>
  );
}
