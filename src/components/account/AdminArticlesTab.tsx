"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Upload, Trash2, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { useBlogStore } from "@/data/blogStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const AdminArticlesTab = () => {
  const { articles, addArticle, removeArticle } = useBlogStore();
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newExcerpt, setNewExcerpt] = useState("");
  const [newImage, setNewImage] = useState("");

  const filtered = articles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleUploadMd = (articleSlug: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".md,.markdown,.txt";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
        useBlogStore.getState().updateArticleContent(articleSlug, content);
        toast.success(`Content updated for "${articleSlug}"`);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleAddArticle = () => {
    if (!newTitle.trim()) {
      toast.error("Title is required");
      return;
    }
    const slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    addArticle({
      slug,
      title: newTitle.trim(),
      excerpt: newExcerpt.trim() || "No description provided.",
      content: "",
      date: new Date().toISOString().split("T")[0],
      author: newAuthor.trim() || "Admin",
      category: newCategory.trim() || "General",
      readTime: "3 min",
      image: newImage.trim() || "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=800&q=80",
    });

    setNewTitle("");
    setNewAuthor("");
    setNewCategory("");
    setNewExcerpt("");
    setNewImage("");
    setAddOpen(false);
    toast.success("Article created — upload a .md file to add content");
  };

  const handleDelete = (slug: string, title: string) => {
    removeArticle(slug);
    toast.success(`"${title}" deleted`);
  };

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
        <CardTitle className="font-display text-xl flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Blog Articles
        </CardTitle>
        <Button size="sm" className="gap-2" onClick={() => setAddOpen(true)}>
          <Plus className="w-4 h-4" /> New Article
        </Button>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 font-body text-sm"
          />
        </div>

        {/* Table */}
        <div className="rounded-md border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-body text-xs font-semibold">Title</TableHead>
                <TableHead className="font-body text-xs font-semibold">Author</TableHead>
                <TableHead className="font-body text-xs font-semibold">Category</TableHead>
                <TableHead className="font-body text-xs font-semibold">Date</TableHead>
                <TableHead className="font-body text-xs font-semibold text-center">Content</TableHead>
                <TableHead className="font-body text-xs font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground font-body">
                    No articles found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((article) => (
                  <TableRow key={article.slug} className="hover:bg-muted/20">
                    <TableCell className="font-body text-sm font-medium max-w-[250px] truncate">
                      {article.title}
                    </TableCell>
                    <TableCell className="font-body text-sm text-muted-foreground">
                      {article.author}
                    </TableCell>
                    <TableCell className="font-body text-sm text-muted-foreground">
                      {article.category}
                    </TableCell>
                    <TableCell className="font-body text-sm text-muted-foreground">
                      {new Date(article.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-block w-2 h-2 rounded-full ${article.content ? "bg-green-500" : "bg-yellow-400"}`} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 text-xs"
                          onClick={() => handleUploadMd(article.slug)}
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Upload .md
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive gap-1.5 text-xs"
                          onClick={() => handleDelete(article.slug, article.title)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <p className="text-xs text-muted-foreground mt-3 font-body">
          {filtered.length} article{filtered.length !== 1 ? "s" : ""} total - Upload .md files to set article content
        </p>
      </CardContent>

      {/* Add Article Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">New Article</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="font-body text-sm">Title *</Label>
              <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Article title" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="font-body text-sm">Author</Label>
                <Input value={newAuthor} onChange={(e) => setNewAuthor(e.target.value)} placeholder="Author name" className="mt-1" />
              </div>
              <div>
                <Label className="font-body text-sm">Category</Label>
                <Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="e.g. Food Guide" className="mt-1" />
              </div>
            </div>
            <div>
              <Label className="font-body text-sm">Excerpt</Label>
              <Textarea value={newExcerpt} onChange={(e) => setNewExcerpt(e.target.value)} placeholder="Short description..." className="mt-1" rows={2} />
            </div>
            <div>
              <Label className="font-body text-sm">Cover Image URL</Label>
              <Input value={newImage} onChange={(e) => setNewImage(e.target.value)} placeholder="https://..." className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddArticle}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminArticlesTab;
