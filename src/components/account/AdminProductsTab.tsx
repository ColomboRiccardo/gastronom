"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingBag, Plus, ArrowUpDown, Search, Loader2 } from "lucide-react";
import ProductModal from "@/components/ProductModal";
import { type Product } from "@/components/ProductCard";
import BulkActionBar from "./BulkActionBar";
import { toast } from "sonner";
import {
  bulkUpdatePublished,
  fetchAllProductsForAdmin,
  updateProductPublished,
} from "@/lib/products/queries";
import { type AdminProduct } from "@/lib/products/types";

const stockColor = (status: string) => {
  switch (status) {
    case "In Stock": return "bg-green-100 text-green-800 border-green-200";
    case "Low Stock": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Out of Stock": return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-muted text-muted-foreground";
  }
};

const publishedColor = (published: boolean) =>
  published
    ? "bg-green-100 text-green-800 border-green-200"
    : "bg-muted text-muted-foreground";

type SortKey = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "stock-asc" | "stock-desc" | "category-asc" | "category-desc";

const toProduct = (p: AdminProduct): Product => ({
  id: p.id,
  name: p.name,
  description: p.description,
  price: p.priceDisplay,
  priceNum: p.price,
  image: p.image,
  category: p.category,
});

const AdminProductsTab = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [publishedFilter, setPublishedFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortKey>("name-asc");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const loadProducts = async () => {
    setLoading(true);
    const data = await fetchAllProductsForAdmin();
    if (data === null) {
      toast.error("Could not load products from Supabase");
      setProducts([]);
    } else {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))].sort((a, b) => a.localeCompare(b)),
    [products],
  );

  const results = useMemo(() => {
    let list = [...products];
    if (statusFilter !== "all") {
      list = list.filter((p) => p.status.toLowerCase().replace(/\s/g, "-") === statusFilter);
    }
    if (publishedFilter === "published") {
      list = list.filter((p) => p.published);
    } else if (publishedFilter === "draft") {
      list = list.filter((p) => !p.published);
    }
    if (categoryFilter !== "all") list = list.filter((p) => p.category === categoryFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    const [key, dir] = sortBy.split("-") as [string, string];
    list.sort((a, b) => {
      let cmp = 0;
      switch (key) {
        case "name": cmp = a.name.localeCompare(b.name); break;
        case "price": cmp = a.price - b.price; break;
        case "stock": cmp = a.stock - b.stock; break;
        case "category": cmp = a.category.localeCompare(b.category); break;
      }
      return dir === "desc" ? -cmp : cmp;
    });
    return list;
  }, [products, statusFilter, publishedFilter, categoryFilter, sortBy, search]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const openEdit = (p: AdminProduct) => {
    setSelectedProduct(toProduct(p));
    setModalOpen(true);
  };

  const handleTogglePublished = async (productId: number, published: boolean) => {
    const ok = await updateProductPublished(productId, published);
    if (ok) {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, published } : p)),
      );
      toast.success(published ? "Product published" : "Product unpublished");
    } else {
      toast.error("Failed to update product visibility");
    }
  };

  const bulkPublish = async (published: boolean) => {
    const ids = Array.from(selectedIds);
    const ok = await bulkUpdatePublished(ids, published);
    if (ok) {
      setProducts((prev) =>
        prev.map((p) => (selectedIds.has(p.id) ? { ...p, published } : p)),
      );
      toast.success(`${ids.length} products ${published ? "published" : "unpublished"}`);
      setSelectedIds(new Set());
    } else {
      toast.error("Failed to update selected products");
    }
  };

  const allSelected = results.length > 0 && results.every((p) => selectedIds.has(p.id));

  return (
    <>
      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="font-display text-xl flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Product Catalog
                <span className="text-sm font-body font-normal text-muted-foreground ml-2">
                  ({results.length} products)
                </span>
              </CardTitle>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2" disabled>
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                </SelectContent>
              </Select>
              <Select value={publishedFilter} onValueChange={setPublishedFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Visibility" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Visibility</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Stock Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
                <SelectTrigger className="w-[190px]">
                  <div className="flex items-center gap-2"><ArrowUpDown className="w-3.5 h-3.5" /><SelectValue placeholder="Sort by" /></div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="price-desc">Price (High-Low)</SelectItem>
                  <SelectItem value="price-asc">Price (Low-High)</SelectItem>
                  <SelectItem value="stock-desc">Stock (High-Low)</SelectItem>
                  <SelectItem value="stock-asc">Stock (Low-High)</SelectItem>
                  <SelectItem value="category-asc">Category (A-Z)</SelectItem>
                  <SelectItem value="category-desc">Category (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <BulkActionBar
            selectedCount={selectedIds.size}
            totalCount={results.length}
            onSelectAll={() => setSelectedIds(new Set(results.map((p) => p.id)))}
            onClearSelection={() => setSelectedIds(new Set())}
            actions={[
              {
                label: "Publish",
                onClick: () => void bulkPublish(true),
              },
              {
                label: "Unpublish",
                variant: "outline",
                onClick: () => void bulkPublish(false),
              },
            ]}
          />

          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading products...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="font-medium">No products found</p>
              <p className="text-sm mt-1">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="w-10">
                        <Checkbox checked={allSelected} onCheckedChange={() => allSelected ? setSelectedIds(new Set()) : setSelectedIds(new Set(results.map((p) => p.id)))} />
                      </TableHead>
                      {["Product", "Category", "Price", "Stock", "Status", "Published", ""].map((h) => (
                        <TableHead key={h} className="font-semibold text-xs uppercase tracking-wider">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((p) => (
                      <TableRow key={p.id} className="border-border">
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox checked={selectedIds.has(p.id)} onCheckedChange={() => toggleSelect(p.id)} />
                        </TableCell>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell className="text-muted-foreground">{p.category}</TableCell>
                        <TableCell className="font-semibold">{p.priceDisplay}</TableCell>
                        <TableCell>{p.stock}</TableCell>
                        <TableCell><Badge variant="outline" className={stockColor(p.status)}>{p.status}</Badge></TableCell>
                        <TableCell>
                          <Badge variant="outline" className={publishedColor(p.published)}>
                            {p.published ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell className="space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary"
                            onClick={() => void handleTogglePublished(p.id, !p.published)}
                          >
                            {p.published ? "Unpublish" : "Publish"}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-primary hover:text-primary" onClick={() => openEdit(p)}>Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="md:hidden space-y-4">
                {results.map((p) => (
                  <div key={p.id} className="border border-border rounded-lg p-4 space-y-2">
                    <div className="flex items-start gap-3">
                      <Checkbox checked={selectedIds.has(p.id)} onCheckedChange={() => toggleSelect(p.id)} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-medium">{p.name}</span>
                          <div className="flex flex-col items-end gap-1">
                            <Badge variant="outline" className={stockColor(p.status)}>{p.status}</Badge>
                            <Badge variant="outline" className={publishedColor(p.published)}>
                              {p.published ? "Published" : "Draft"}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{p.category}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">{p.priceDisplay}</span>
                          <span className="text-sm text-muted-foreground">{p.stock} in stock</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary flex-1"
                            onClick={() => void handleTogglePublished(p.id, !p.published)}
                          >
                            {p.published ? "Unpublish" : "Publish"}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-primary flex-1" onClick={() => openEdit(p)}>Edit</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <ProductModal product={selectedProduct} open={modalOpen} onOpenChange={setModalOpen} mode="admin" />
    </>
  );
};

export default AdminProductsTab;
