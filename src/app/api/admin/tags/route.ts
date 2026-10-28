import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth/server";
import { toLanguage } from "@/lib/i18n/translate";
import {
  createAdminTag,
  deleteAdminTag,
  fetchAdminTags,
  saveAdminTag,
} from "@/lib/products/tag-admin";
import { type AdminTagUpdate } from "@/lib/products/types";

async function requireAdmin() {
  const user = await getAuthenticatedUser();
  if (!user || (user.role !== "admin" && user.role !== "manager")) {
    return null;
  }
  return user;
}

export async function GET() {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tags = await fetchAdminTags();
  return NextResponse.json({ tags });
}

export async function POST(request: Request) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { name?: string; language?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const created = await createAdminTag(body.name, toLanguage(body.language));
  if (!created) {
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 });
  }

  return NextResponse.json({ tag: created });
}

export async function PATCH(request: Request) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { tagId?: number; update?: AdminTagUpdate };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.tagId == null || !body.update) {
    return NextResponse.json({ error: "tagId and update required" }, { status: 400 });
  }

  const ok = await saveAdminTag(body.tagId, {
    ...body.update,
    language: toLanguage(body.update.language),
  });

  if (!ok) {
    return NextResponse.json({ error: "Failed to save tag" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const tagId = Number.parseInt(searchParams.get("tagId") || "", 10);
  if (Number.isNaN(tagId)) {
    return NextResponse.json({ error: "tagId required" }, { status: 400 });
  }

  const ok = await deleteAdminTag(tagId);
  if (!ok) {
    return NextResponse.json({ error: "Failed to delete tag" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
