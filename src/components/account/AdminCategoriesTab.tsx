"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FolderTree, Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { LANGUAGES, useLanguage } from "@/context/LanguageContext";
import { type Language } from "@/lib/i18n/translate";
import { resolveCategoryName } from "@/lib/products/resolve-copy";
import { type AdminCategory } from "@/lib/products/types";

const AdminCategoriesTab = () => {
  const { t, language } = useLanguage();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editLanguage, setEditLanguage] = useState<Language>(language);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data.categories ?? []);
    } catch {
      toast.error(t("admin_categories.toast_load_failed"));
      setCategories([]);
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

  const startEdit = (cat: AdminCategory) => {
    setEditingId(cat.id);
    setEditName(resolveCategoryName(cat, cat.translations, editLanguage));
  };

  const handleLanguageChange = (lang: Language) => {
    setEditLanguage(lang);
    if (editingId != null) {
      const cat = categories.find((c) => c.id === editingId);
      if (cat) {
        setEditName(resolveCategoryName(cat, cat.translations, lang));
      }
    }
  };

  const handleSave = async () => {
    if (editingId == null || !editName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: editingId,
          update: { language: editLanguage, name: editName },
        }),
      });
      if (!res.ok) {
        toast.error(t("admin_categories.toast_save_failed"));
        return;
      }
      toast.success(t("admin_categories.toast_saved", { language: editLanguage.toUpperCase() }));
      setEditingId(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, language: editLanguage }),
      });
      if (!res.ok) {
        toast.error(t("admin_categories.toast_create_failed"));
        return;
      }
      toast.success(t("admin_categories.toast_created"));
      setNewName("");
      await load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-border">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-primary" />
            {t("admin_categories.title")}
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
        <p className="text-sm text-muted-foreground">{t("admin_categories.hint")}</p>
        <div className="flex flex-wrap gap-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={t("admin_categories.new_placeholder")}
            className="max-w-sm"
          />
          <Button className="gap-1.5" onClick={() => void handleCreate()} disabled={saving || !newName.trim()}>
            <Plus className="w-4 h-4" />
            {t("admin_categories.create")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground py-8 text-center">{t("common.loading")}</p>
        ) : categories.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">{t("admin_categories.empty")}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>{t("admin_categories.col_name")}</TableHead>
                <TableHead>{t("admin_categories.col_slug")}</TableHead>
                <TableHead>{t("admin_categories.col_products")}</TableHead>
                <TableHead>{t("admin_categories.col_source")}</TableHead>
                <TableHead className="w-40" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => {
                const display = resolveCategoryName(cat, cat.translations, editLanguage);
                const isEditing = editingId === cat.id;
                return (
                  <TableRow key={cat.id} className="border-border">
                    <TableCell>
                      {isEditing ? (
                        <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                      ) : (
                        <span className="font-medium">{display}</span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{cat.slug}</TableCell>
                    <TableCell>{cat.productCount}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {cat.sourceKey ?? t("admin_categories.custom")}
                    </TableCell>
                    <TableCell className="text-right">
                      {isEditing ? (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" className="gap-1" disabled={saving} onClick={() => void handleSave()}>
                            <Save className="w-3.5 h-3.5" />
                            {t("common.save")}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                            {t("common.cancel")}
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="ghost" onClick={() => startEdit(cat)}>
                          {t("admin_categories.edit")}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminCategoriesTab;
