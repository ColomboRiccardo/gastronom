import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
  const user = await getAuthenticatedUser();
  if (!user || (user.role !== "admin" && user.role !== "manager")) {
    return null;
  }
  return user;
}

export async function GET(request: Request) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() ?? "";

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Admin client error";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  let query = supabase
    .from("products")
    .select("id, name, price")
    .order("name", { ascending: true })
    .limit(500);

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch product options:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const products = (data || []).map((row) => ({
    id: row.id as number,
    name: row.name as string,
    price: Number(row.price),
  }));

  return NextResponse.json({ products });
}
