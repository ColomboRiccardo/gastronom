import { createClient } from "@/lib/supabase/server";

import { type AppUser } from "./types";

export async function getAuthenticatedUser(): Promise<AppUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, role, phone, address")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? "",
    name: profile?.name ?? user.email?.split("@")[0] ?? "",
    role: profile?.role ?? "customer",
    phone: profile?.phone ?? null,
    address: profile?.address ?? null,
  };
}
