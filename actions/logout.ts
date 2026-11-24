"use server";

import { deleteCurrentSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function logout(): Promise<void> {
  await deleteCurrentSession();
  redirect("/");
}
