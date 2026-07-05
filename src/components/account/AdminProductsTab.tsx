"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingBag, Plus, ArrowUpDown, Search, Loader2, LayoutGrid, Table as TableIcon } from "lucide-react";
import ProductModal from "@/components/ProductModal";
import { type Product } from "@/components/ProductCard";
import AdminProductCard from "./AdminProductCard";
import ProductSyncLockButton from "./ProductSyncLockButton";
import BulkActionBar from "./BulkActionBar";
import ListPagination from "@/components/ListPagination";
import { toast } from "sonner";
import { bulkUpdatePublished, unlockProductFields, updateProductPublished } from "@/lib/products/admin-client";
import {
  matchesAdminProductFilters,
  patchAdminProduct,
  upsertAdminProductInList,
} from "@/lib/products/admin-patch";
import {
  ADMIN_PRODUCTS_PAGE_SIZE,
  ADMIN_PRODUCTS_PAGE_SIZE_OPTIONS,
  type AdminProductsPageSize,
  type AdminProductsSortKey,
} from "@/lib/products/constants";
import { type AdminProduct, type AdminProductUpdate } from "@/lib/products/types";

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

const toProduct = (p: AdminProduct): Product => ({
  id: p.id,
  name: p.name,
  description: p.description,
  price: p.priceDisplay,
  priceNum: p.price,
  image: p.image,
  category: p.category,
  badge: p.badge ?? undefined,
});

type AdminViewMode = "table" | "grid";

const AdminProductsTab = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("all");
  const [publishedFilter, setPublishedFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<AdminProductsSortKey>("name-asc");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedAdminProduct, setSelectedAdminProduct] = useState<AdminProduct | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<AdminViewMode>("table");
  const [pageSize, setPageSize] = useState<AdminProductsPageSize>(ADMIN_PRODUCTS_PAGE_SIZE);
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    void fetch("/api/admin/products?categoriesOnly=true")
      .then((res) => res.json())
      .then((data: { categories?: string[] }) => {
        setCategories(data.categories ?? []);
      })
      .catch(() => setCategories([]));
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      category: categoryFilter,
      published: publishedFilter,
      status: statusFilter,
      sort: sortBy,
    });
    if (debouncedSearch.trim()) {
      params.set("search", debouncedSearch.trim());
    }

    try {
      const res = await fetch(`/api/admin/products?${params.toString()}`);
      if (!res.ok) {
        toast.error("Could not load products");
        setProducts([]);
        return;
      }
      const data = await res.json();
      setProducts(data.items ?? []);
      setTotalCount(data.totalCount ?? 0);
      setTotalPages(data.totalPages ?? 1);
      setPage(data.page ?? 1);
    } catch {
      toast.error("Could not load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, categoryFilter, publishedFilter, statusFilter, sortBy, debouncedSearch]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const resetToFirstPage = () => {
    if (page !== 1) {
      setPage(1);
    }
  };

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
    setSelectedAdminProduct(p);
    setSelectedProduct(toProduct(p));
    setModalOpen(true);
  };

  const filterState = {
    search: debouncedSearch,
    category: categoryFilter,
    published: publishedFilter,
    status: statusFilter,
  };

  const applyProductUpdate = (productId: number, updater: (product: AdminProduct) => AdminProduct) => {
    setProducts((prev) => {
      const current = prev.find((p) => p.id === productId);
      if (!current) return prev;
      const updated = updater(current);
      return upsertAdminProductInList(prev, updated, filterState);
    });
  };

  const handleTogglePublished = async (productId: number, published: boolean) => {
    const ok = await updateProductPublished(productId, published);
    if (ok) {
      applyProductUpdate(productId, (p) => ({
        ...p,
        published,
        editorLockedFields: [...new Set([...p.editorLockedFields, "published"])],
      }));
      toast.success(published ? "Product published" : "Product unpublished");
    } else {
      toast.error("Failed to update product visibility");
    }
  };

  const handleUnlockFields = async (productId: number) => {
    const ok = await unlockProductFields(productId);
    if (ok) {
      applyProductUpdate(productId, (p) => ({ ...p, editorLockedFields: [] }));
      toast.success("Sync protection removed — next Lackmann sync can update these fields");
    } else {
      toast.error("Failed to unlock product fields");
    }
  };

  const handleAdminSaved = (update: AdminProductUpdate) => {
    if (!selectedAdminProduct) return;
    const updated = patchAdminProduct(selectedAdminProduct, update);
    setProducts((prev) => upsertAdminProductInList(prev, updated, filterState));
  };

  const bulkPublish = async (published: boolean) => {
    if (bulkLoading) return;

    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    setBulkLoading(true);
    try {
      const ok = await bulkUpdatePublished(ids, published);
      if (ok) {
        setProducts((prev) =>
          prev
            .map((p) =>
              selectedIds.has(p.id)
                ? {
                    ...p,
                    published,
                    editorLockedFields: [...new Set([...p.editorLockedFields, "published"])],
                  }
                : p,
            )
            .filter((p) => matchesAdminProductFilters(p, filterState)),
        );
        toast.success(`${ids.length} products ${published ? "published" : "unpublished"}`);
        setSelectedIds(new Set());
      } else {
        toast.error("Failed to update selected products");
      }
    } finally {
      setBulkLoading(false);
    }
  };

  const allSelected = products.length > 0 && products.every((p) => selectedIds.has(p.id));

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
                  ({totalCount} products)
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
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    resetToFirstPage();
                  }}
                  className="pl-9"
                />
              </div>
              <Select
                value={categoryFilter}
                onValueChange={(v) => {
                  setCategoryFilter(v);
                  resetToFirstPage();
                }}
              >
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                </SelectContent>
              </Select>
              <Select
                value={publishedFilter}
                onValueChange={(v) => {
                  setPublishedFilter(v);
                  resetToFirstPage();
                }}
              >
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Visibility" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Visibility</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={statusFilter}
                onValueChange={(v) => {
                  setStatusFilter(v);
                  resetToFirstPage();
                }}
              >
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Stock Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sortBy}
                onValueChange={(v) => {
                  setSortBy(v as AdminProductsSortKey);
                  resetToFirstPage();
                }}
              >
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
              <Select
                value={String(pageSize)}
                onValueChange={(v) => {
                  setPageSize(Number(v) as AdminProductsPageSize);
                  resetToFirstPage();
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Per page" />
                </SelectTrigger>
                <SelectContent>
                  {ADMIN_PRODUCTS_PAGE_SIZE_OPTIONS.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size} per page
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex border border-border rounded-md overflow-hidden shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`p-2 transition-colors ${
                    viewMode === "table"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label="Table view"
                >
                  <TableIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${
                    viewMode === "grid"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <BulkActionBar
            selectedCount={selectedIds.size}
            totalCount={products.length}
            onSelectAll={() => setSelectedIds(new Set(products.map((p) => p.id)))}
            onClearSelection={() => setSelectedIds(new Set())}
            disabled={bulkLoading}
            actions={[
              { label: bulkLoading ? "Updating..." : "Publish", onClick: () => void bulkPublish(true) },
              { label: bulkLoading ? "Updating..." : "Unpublish", variant: "outline", onClick: () => void bulkPublish(false) },
            ]}
          />

          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading products...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="font-medium">No products found</p>
              <p className="text-sm mt-1">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <>
              {viewMode === "table" ? (
                <>
                  <div className="hidden md:block">
                    <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="w-10">
                        <Checkbox
                          checked={allSelected}
                          onCheckedChange={() =>
                            allSelected
                              ? setSelectedIds(new Set())
                              : setSelectedIds(new Set(products.map((p) => p.id)))
                          }
                        />
                      </TableHead>
                      {["Product", "Category", "Price", "Stock", "Status", "Published", "Publish", "Edit", "Lock"].map((h) => (
                        <TableHead
                          key={h}
                          className={`font-semibold text-xs uppercase tracking-wider ${
                            h === "Lock"
                              ? "w-12 text-center"
                              : h === "Publish"
                                ? "w-28 text-left"
                                : h === "Edit"
                                  ? "w-20 text-left"
                                  : ""
                          }`}
                        >
                          {h}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((p) => (
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
                        <TableCell className="w-28 px-2 text-left">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary px-2"
                            onClick={() => void handleTogglePublished(p.id, !p.published)}
                          >
                            {p.published ? "Unpublish" : "Publish"}
                          </Button>
                        </TableCell>
                        <TableCell className="w-20 px-2 text-left">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary px-2"
                            onClick={() => openEdit(p)}
                          >
                            Edit
                          </Button>
                        </TableCell>
                        <TableCell className="w-12 px-2 text-center">
                          <ProductSyncLockButton
                            lockedFields={p.editorLockedFields}
                            onUnlock={() => void handleUnlockFields(p.id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                    </Table>
                  </div>
                  <div className="md:hidden space-y-4">
                    {products.map((p) => (
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
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-primary px-2"
                                onClick={() => void handleTogglePublished(p.id, !p.published)}
                              >
                                {p.published ? "Unpublish" : "Publish"}
                              </Button>
                              <Button variant="ghost" size="sm" className="text-primary px-2" onClick={() => openEdit(p)}>
                                Edit
                              </Button>
                              <div className="ml-auto">
                                <ProductSyncLockButton
                                  lockedFields={p.editorLockedFields}
                                  onUnlock={() => void handleUnlockFields(p.id)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 items-stretch">
                  {products.map((p) => (
                    <AdminProductCard
                      key={p.id}
                      product={p}
                      selected={selectedIds.has(p.id)}
                      onToggleSelect={() => toggleSelect(p.id)}
                      onTogglePublished={() => void handleTogglePublished(p.id, !p.published)}
                      onEdit={() => openEdit(p)}
                      onUnlock={() => void handleUnlockFields(p.id)}
                    />
                  ))}
                </div>
              )}
              <ListPagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </CardContent>
      </Card>

      <ProductModal
        product={selectedProduct}
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setSelectedAdminProduct(null);
        }}
        mode="admin"
        adminStock={selectedAdminProduct?.stock ?? 0}
        adminBadge={selectedAdminProduct?.badge ?? null}
        onAdminSaved={handleAdminSaved}
      />
    </>
  );
};

export default AdminProductsTab;
