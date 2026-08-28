"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, FileSpreadsheet, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useLanguage, type TranslateVars } from "@/context/LanguageContext";
import { formatDateTime } from "@/lib/i18n/format";

interface CsvProduct {
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  status: string;
}

interface ImportError {
  row: number;
  messageKey: string;
  params?: TranslateVars;
}

interface ImportResult {
  total: number;
  valid: CsvProduct[];
  errors: ImportError[];
}

const EXPECTED_HEADERS = ["name", "description", "category", "price", "stock", "status"];

const currentProducts = [
  { id: 1, name: "Stolichnaya Vodka", description: "Classic Russian vodka, 1L", category: "Vodka & Spirits", price: 30.00, stock: 48, status: "In Stock" },
  { id: 2, name: "Red Caviar 100g", description: "Wild Pacific salmon roe, 100g", category: "Caviar & Roe", price: 45.00, stock: 12, status: "Low Stock" },
  { id: 3, name: "Kolbasa Moskovskaya", description: "Traditional Moscow-style sausage, 400g", category: "Kolbasa & Meats", price: 14.00, stock: 35, status: "In Stock" },
  { id: 4, name: "Pickled Cucumbers", description: "Traditional brine cucumbers, 900ml", category: "Pickles & Preserves", price: 6.50, stock: 60, status: "In Stock" },
  { id: 5, name: "Black Caviar 50g", description: "Premium sturgeon caviar, 50g", category: "Caviar & Roe", price: 85.00, stock: 5, status: "Low Stock" },
  { id: 6, name: "Matrioshka Set (5pc)", description: "Hand-painted nesting dolls, 5 pcs", category: "Gifts & Souvenirs", price: 45.00, stock: 22, status: "In Stock" },
  { id: 7, name: "Beluga Vodka", description: "Premium Russian vodka, 700ml", category: "Vodka & Spirits", price: 55.00, stock: 0, status: "Out of Stock" },
  { id: 8, name: "Dried Vobla", description: "Salted & dried Caspian roach, 300g", category: "Dried Fish", price: 8.50, stock: 40, status: "In Stock" },
  { id: 9, name: "Sprats in Oil", description: "Latvian smoked sprats, 240g", category: "Pickles & Preserves", price: 4.90, stock: 75, status: "In Stock" },
];

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCsv(text: string): ImportResult {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) {
    return { total: 0, valid: [], errors: [{ row: 0, messageKey: "management.err_empty" }] };
  }

  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z]/g, ""));
  const missingHeaders = EXPECTED_HEADERS.filter((h) => !headers.includes(h));
  if (missingHeaders.length > 0) {
    return {
      total: 0,
      valid: [],
      errors: [
        {
          row: 1,
          messageKey: "management.err_missing_columns",
          params: { columns: missingHeaders.join(", ") },
        },
      ],
    };
  }

  const nameIdx = headers.indexOf("name");
  const descIdx = headers.indexOf("description");
  const catIdx = headers.indexOf("category");
  const priceIdx = headers.indexOf("price");
  const stockIdx = headers.indexOf("stock");
  const statusIdx = headers.indexOf("status");

  const valid: CsvProduct[] = [];
  const errors: ImportError[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    const rowNum = i + 1;
    const name = cols[nameIdx] || "";
    const description = cols[descIdx] || "";
    const category = cols[catIdx] || "";
    const priceStr = cols[priceIdx] || "";
    const stockStr = cols[stockIdx] || "";
    const status = cols[statusIdx] || "";

    if (!name) {
      errors.push({ row: rowNum, messageKey: "management.err_missing_name" });
      continue;
    }
    const price = parseFloat(priceStr);
    if (isNaN(price) || price < 0) {
      errors.push({
        row: rowNum,
        messageKey: "management.err_invalid_price",
        params: { value: priceStr, name },
      });
      continue;
    }
    const stock = parseInt(stockStr, 10);
    if (isNaN(stock) || stock < 0) {
      errors.push({
        row: rowNum,
        messageKey: "management.err_invalid_stock",
        params: { value: stockStr, name },
      });
      continue;
    }

    valid.push({ name, description, category, price, stock, status: status || "In Stock" });
  }

  return { total: lines.length - 1, valid, errors };
}

function productsToCsv(products: typeof currentProducts): string {
  const header = "name,description,category,price,stock,status";
  const rows = products.map((p) => {
    const escape = (s: string) => (s.includes(",") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s);
    return `${escape(p.name)},${escape(p.description)},${escape(p.category)},${p.price.toFixed(2)},${p.stock},${escape(p.status)}`;
  });
  return [header, ...rows].join("\n");
}

const AdminManagementTab = () => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [importHistory, setImportHistory] = useState<{ date: string; total: number; valid: number; errors: number }[]>([]);

  const handleExport = () => {
    const csv = productsToCsv(currentProducts);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t("management.toast_exported", { count: currentProducts.length }));
  };

  const handleExportTemplate = () => {
    const csv = "name,description,category,price,stock,status\nExample Product,A description,Category Name,9.99,50,In Stock";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "product_import_template.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t("management.toast_template"));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      toast.error(t("management.toast_not_csv"));
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const result = parseCsv(text);
      setImportResult(result);
      setPreviewOpen(true);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const confirmImport = () => {
    if (!importResult) return;
    setImportHistory((prev) => [
      { date: formatDateTime(new Date()), total: importResult.total, valid: importResult.valid.length, errors: importResult.errors.length },
      ...prev,
    ]);
    toast.success(t("management.toast_imported", { count: importResult.valid.length }));
    setPreviewOpen(false);
    setImportResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="p-6 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Download className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display font-semibold">{t("management.export_title")}</h3>
            <p className="text-sm text-muted-foreground">{t("management.export_desc")}</p>
            <Button onClick={handleExport} className="w-full mt-2">
              <Download className="w-4 h-4 mr-2" /> {t("management.export_button")}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <Upload className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-display font-semibold">{t("management.import_title")}</h3>
            <p className="text-sm text-muted-foreground">{t("management.import_desc")}</p>
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileSelect} />
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full mt-2">
              <Upload className="w-4 h-4 mr-2" /> {t("management.import_button")}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold">{t("management.template_title")}</h3>
            <p className="text-sm text-muted-foreground">{t("management.template_desc")}</p>
            <Button onClick={handleExportTemplate} variant="secondary" className="w-full mt-2">
              <FileSpreadsheet className="w-4 h-4 mr-2" /> {t("management.template_button")}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Format info */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-display text-lg">{t("management.csv_format")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">{t("management.csv_columns")}</p>
          <div className="flex flex-wrap gap-2">
            {EXPECTED_HEADERS.map((h) => (
              <Badge key={h} variant="outline" className="font-mono text-xs">{h}</Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            {t("management.status_values")}{" "}
            <span className="font-mono">In Stock</span>, <span className="font-mono">Low Stock</span>, <span className="font-mono">Out of Stock</span>
          </p>
        </CardContent>
      </Card>

      {/* Import history */}
      {importHistory.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display text-lg">{t("management.import_history")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("management.col_date")}</TableHead>
                  <TableHead>{t("management.col_total_rows")}</TableHead>
                  <TableHead>{t("management.col_imported")}</TableHead>
                  <TableHead>{t("management.col_errors")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {importHistory.map((h, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-sm">{h.date}</TableCell>
                    <TableCell>{h.total}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 border-green-200">{h.valid}</Badge>
                    </TableCell>
                    <TableCell>
                      {h.errors > 0 ? (
                        <Badge className="bg-red-100 text-red-800 border-red-200">{h.errors}</Badge>
                      ) : (
                        <Badge variant="outline">0</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Import Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="font-display">{t("management.preview_title")}</DialogTitle>
          </DialogHeader>
          {importResult && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>{t("management.valid_count", { count: importResult.valid.length })}</span>
                </div>
                {importResult.errors.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span>{t("management.error_count", { count: importResult.errors.length })}</span>
                  </div>
                )}
              </div>

              {importResult.errors.length > 0 && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 space-y-1">
                  {importResult.errors.slice(0, 5).map((err, i) => (
                    <p key={i} className="text-xs text-destructive">
                      {t("management.row_error", {
                        row: err.row,
                        message: t(err.messageKey, err.params),
                      })}
                    </p>
                  ))}
                  {importResult.errors.length > 5 && (
                    <p className="text-xs text-muted-foreground">
                      {t("management.and_more", { count: importResult.errors.length - 5 })}
                    </p>
                  )}
                </div>
              )}

              <Separator />

              {importResult.valid.length > 0 && (
                <ScrollArea className="max-h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("management.col_name")}</TableHead>
                        <TableHead>{t("management.col_category")}</TableHead>
                        <TableHead>{t("management.col_price")}</TableHead>
                        <TableHead>{t("management.col_stock")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {importResult.valid.map((p, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium text-sm">{p.name}</TableCell>
                          <TableCell className="text-sm">{p.category}</TableCell>
                          <TableCell className="text-sm">€{p.price.toFixed(2)}</TableCell>
                          <TableCell className="text-sm">{p.stock}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setPreviewOpen(false)}>{t("common.cancel")}</Button>
                <Button onClick={confirmImport} disabled={importResult.valid.length === 0}>
                  {t("management.import_confirm", { count: importResult.valid.length })}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminManagementTab;
