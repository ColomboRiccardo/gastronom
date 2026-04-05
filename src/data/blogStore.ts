import { create } from "zustand";
import { blogArticles as initialArticles, type BlogArticle } from "./blogArticles";

interface BlogStore {
  articles: BlogArticle[];
  addArticle: (article: BlogArticle) => void;
  removeArticle: (slug: string) => void;
  updateArticleContent: (slug: string, content: string) => void;
}

export const useBlogStore = create<BlogStore>((set) => ({
  articles: [...initialArticles],
  addArticle: (article) =>
    set((state) => ({ articles: [article, ...state.articles] })),
  removeArticle: (slug) =>
    set((state) => ({ articles: state.articles.filter((a) => a.slug !== slug) })),
  updateArticleContent: (slug, content) =>
    set((state) => ({
      articles: state.articles.map((a) =>
        a.slug === slug
          ? { ...a, content, readTime: `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min` }
          : a
      ),
    })),
}));
