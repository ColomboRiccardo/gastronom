import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import type { BlogArticle } from "@/data/blogArticles";

interface Props {
  article: BlogArticle;
  layout: "grid" | "list";
  onClick: () => void;
}

const BlogArticleCard = ({ article, layout, onClick }: Props) => {
  if (layout === "list") {
    return (
      <button
        onClick={onClick}
        className="flex gap-5 p-4 rounded-lg border border-border bg-card hover:shadow-md transition-all text-left group"
      >
        <img
          src={article.image}
          alt={article.title}
          className="w-40 h-28 object-cover rounded-md flex-shrink-0"
          loading="lazy"
        />
        <div className="flex flex-col justify-center gap-2 min-w-0">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-body">
              {article.category}
            </Badge>
            <span className="text-xs text-muted-foreground font-body flex items-center gap-1">
              <Clock className="h-3 w-3" /> {article.readTime}
            </span>
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {article.title}
          </h3>
          <p className="font-body text-sm text-muted-foreground line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground font-body mt-1">
            <span>{article.author}</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(article.date).toLocaleDateString()}
            </span>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex flex-col rounded-lg border border-border bg-card overflow-hidden hover:shadow-lg transition-all text-left group"
    >
      <div className="relative overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <Badge
          variant="secondary"
          className="absolute top-3 left-3 text-xs font-body"
        >
          {article.category}
        </Badge>
      </div>
      <div className="p-5 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-3 text-xs text-muted-foreground font-body">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {article.readTime}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(article.date).toLocaleDateString()}
          </span>
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="font-body text-sm text-muted-foreground line-clamp-3 flex-1">
          {article.excerpt}
        </p>
        <p className="font-body text-xs text-muted-foreground mt-2">
          {article.author}
        </p>
      </div>
    </button>
  );
};

export default BlogArticleCard;
