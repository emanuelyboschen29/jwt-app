"use server";

import { refresh, revalidatePath } from "next/cache";
import { isUserRole, type UserRole } from "@/lib/roles";
import { updateUserRoleForAdmin } from "@/lib/auth";

export type RoleFormState = {
  error: string | null;
  success: string | null;
  role: UserRole | null;
};

export async function updateUserRole(
  _previousState: RoleFormState,
  formData: FormData,
): Promise<RoleFormState> {
  const userIdValue = formData.get("userId");
  const roleValue = formData.get("role");
  const userId = typeof userIdValue === "string" ? Number(userIdValue) : NaN;

  if (!Number.isSafeInteger(userId) || userId < 1 || !isUserRole(roleValue)) {
    return { error: "Dados de permissão inválidos.", success: null, role: null };
  }

  const result = await updateUserRoleForAdmin(userId, roleValue);
  if (!result.ok) {
    return { error: result.error, success: null, role: null };
  }

  revalidatePath("/dashboard/usuarios");
  refresh();
  return { error: null, success: "Papel atualizado.", role: roleValue };
}
