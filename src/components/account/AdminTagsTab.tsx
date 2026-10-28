"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpRight, Plus, Save, Tags, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { LANGUAGES, useLanguage } from "@/context/LanguageContext";
import { type Language } from "@/lib/i18n/translate";
import { resolveTagCopy } from "@/lib/products/resolve-copy";
import { type AdminTag } from "@/lib/products/types";

interface EditForm {
  name: string;
  slug: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  sortOrder: string;
  imageUrl: string;
}

const emptyForm: EditForm = {
  name: "",
  slug: "",
  intro: "",
  seoTitle: "",
  seoDescription: "",
  sortOrder: "0",
  imageUrl: "",
};

function formFromTag(tag: AdminTag, lang: Language): EditForm {
  const row = tag.translations.find((r) => r.language === lang);
  return {
    name: row?.name ?? resolveTagCopy(tag, tag.translations, lang).name,
    slug: tag.slug,
    intro: row?.intro ?? "",
    seoTitle: row?.seoTitle ?? "",
    seoDescription: row?.seoDescription ?? "",
    sortOrder: String(tag.sortOrder),
    imageUrl: tag.imageUrl ?? "",
  };
}

const AdminTagsTab = () => {
  const { t, language } = useLanguage();
  const [tags, setTags] = useState<AdminTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [editLanguage, setEditLanguage] = useState<Language>(language);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<EditForm>(emptyForm);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tags");
      const data = await res.json();
      setTags(data.tags ?? []);
    } catch {
      toast.error(t("admin_tags.toast_load_failed"));
      setTags([]);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setEditLanguage(language);
  }, [language]);

  const setField = (key: keyof EditForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const startEdit = (tag: AdminTag) => {
    setEditingId(tag.id);
    setForm(formFromTag(tag, editLanguage));
  };

  const handleLanguageChange = (lang: Language) => {
    setEditLanguage(lang);
    if (editingId != null) {
      const tag = tags.find((item) => item.id === editingId);
      if (tag) setForm(formFromTag(tag, lang));
    }
  };

  const patchTag = async (tagId: number, update: Record<string, unknown>) => {
    const res = await fetch("/api/admin/tags", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tagId, update: { language: editLanguage, ...update } }),
    });
    return res.ok;
  };

  const handleSave = async () => {
    if (editingId == null || !form.name.trim()) return;
    setSaving(true);
    try {
      const sortOrder = Number.parseInt(form.sortOrder, 10);
      const ok = await patchTag(editingId, {
        name: form.name,
        slug: form.slug,
        intro: form.intro,
        seoTitle: form.seoTitle,
        seoDescription: form.seoDescription,
        sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
        imageUrl: form.imageUrl.trim() || null,
      });
      if (!ok) {
        toast.error(t("admin_tags.toast_save_failed"));
        return;
      }
      toast.success(t("admin_tags.toast_saved", { language: editLanguage.toUpperCase() }));
      setEditingId(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (tag: AdminTag) => {
    setSaving(true);
    try {
      // The PATCH route needs a name for the translation row; reuse what is already stored.
      const current = resolveTagCopy(tag, tag.translations, editLanguage);
      const ok = await patchTag(tag.id, { name: current.name, published: !tag.published });
      if (!ok) {
        toast.error(t("admin_tags.toast_save_failed"));
        return;
      }
      toast.success(tag.published ? t("admin_tags.toast_unpublished") : t("admin_tags.toast_published"));
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, language: editLanguage }),
      });
      if (!res.ok) {
        toast.error(t("admin_tags.toast_create_failed"));
        return;
      }
      toast.success(t("admin_tags.toast_created"));
      setNewName("");
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (tag: AdminTag) => {
    if (!window.confirm(t("admin_tags.confirm_delete", { name: tag.name }))) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/tags?tagId=${tag.id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error(t("admin_tags.toast_delete_failed"));
        return;
      }
      toast.success(t("admin_tags.toast_deleted"));
      if (editingId === tag.id) setEditingId(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const fieldLabel = "text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block";

  return (
    <Card className="border-border">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <Tags className="w-5 h-5 text-primary" />
            {t("admin_tags.title")}
          </CardTitle>
          <Select value={editLanguage} onValueChange={(v) => handleLanguageChange(v as Language)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground">{t("admin_tags.hint")}</p>
        <div className="flex flex-wrap gap-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={t("admin_tags.new_placeholder")}
            className="max-w-sm"
          />
          <Button className="gap-1.5" onClick={() => void handleCreate()} disabled={saving || !newName.trim()}>
            <Plus className="w-4 h-4" />
            {t("admin_tags.create")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <p className="text-sm text-muted-foreground py-8 text-center">{t("common.loading")}</p>
        ) : tags.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">{t("admin_tags.empty")}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>{t("admin_tags.col_name")}</TableHead>
                <TableHead>{t("admin_tags.col_slug")}</TableHead>
                <TableHead>{t("admin_tags.col_products")}</TableHead>
                <TableHead>{t("admin_tags.col_status")}</TableHead>
                <TableHead className="w-56" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.map((tag) => {
                const display = resolveTagCopy(tag, tag.translations, editLanguage).name;
                return (
                  <TableRow key={tag.id} className={`border-border ${editingId === tag.id ? "bg-muted/40" : ""}`}>
                    <TableCell className="font-medium">{display}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {tag.published ? (
                        <Link
                          href={`/collections/${encodeURIComponent(tag.slug)}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 hover:text-primary"
                        >
                          {tag.slug}
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      ) : (
                        tag.slug
                      )}
                    </TableCell>
                    <TableCell>{tag.productCount}</TableCell>
                    <TableCell>
                      <Badge variant={tag.published ? "default" : "secondary"}>
                        {tag.published ? t("admin_tags.published") : t("admin_tags.draft")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button size="sm" variant="ghost" onClick={() => startEdit(tag)} disabled={saving}>
                          {t("admin_tags.edit")}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => void handleTogglePublish(tag)} disabled={saving}>
                          {tag.published ? t("admin_tags.unpublish") : t("admin_tags.publish")}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => void handleDelete(tag)}
                          disabled={saving}
                          aria-label={t("admin_tags.delete")}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {editingId != null && (
          <div className="rounded-lg border border-border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg">
                {t("admin_tags.editing", { language: editLanguage.toUpperCase() })}
              </h3>
              <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                {t("common.cancel")}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={fieldLabel}>{t("admin_tags.col_name")}</label>
                <Input value={form.name} onChange={(e) => setField("name", e.target.value)} />
              </div>
              <div>
                <label className={fieldLabel}>{t("admin_tags.slug_label")}</label>
                <Input value={form.slug} onChange={(e) => setField("slug", e.target.value)} className="font-mono" />
                <p className="text-xs text-muted-foreground mt-1">{t("admin_tags.slug_hint")}</p>
              </div>
              <div>
                <label className={fieldLabel}>{t("admin_tags.seo_title_label")}</label>
                <Input
                  value={form.seoTitle}
                  onChange={(e) => setField("seoTitle", e.target.value)}
                  placeholder={form.name}
                  maxLength={70}
                />
                <p className="text-xs text-muted-foreground mt-1">{form.seoTitle.length}/70</p>
              </div>
              <div>
                <label className={fieldLabel}>{t("admin_tags.sort_label")}</label>
                <Input
                  type="number"
                  step="1"
                  value={form.sortOrder}
                  onChange={(e) => setField("sortOrder", e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className={fieldLabel}>{t("admin_tags.seo_description_label")}</label>
                <Textarea
                  value={form.seoDescription}
                  onChange={(e) => setField("seoDescription", e.target.value)}
                  rows={2}
                  maxLength={170}
                />
                <p className="text-xs text-muted-foreground mt-1">{form.seoDescription.length}/170</p>
              </div>
              <div className="md:col-span-2">
                <label className={fieldLabel}>{t("admin_tags.intro_label")}</label>
                <Textarea
                  value={form.intro}
                  onChange={(e) => setField("intro", e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">{t("admin_tags.intro_hint")}</p>
              </div>
              <div className="md:col-span-2">
                <label className={fieldLabel}>{t("admin_tags.image_label")}</label>
                <Input
                  value={form.imageUrl}
                  onChange={(e) => setField("imageUrl", e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button className="gap-1.5" disabled={saving || !form.name.trim()} onClick={() => void handleSave()}>
                <Save className="w-4 h-4" />
                {t("common.save")}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminTagsTab;
