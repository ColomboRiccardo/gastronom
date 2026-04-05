import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import type { BlogArticle } from "@/data/blogArticles";

interface Props {
  article: BlogArticle;
}

const BlogArticleView = ({ article }: Props) => {
  // Simple markdown-ish rendering: headings, lists, paragraphs
  const renderContent = (raw: string) => {
    const lines = raw.split("\n");
    const elements: React.ReactElement[] = [];
    let key = 0;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        elements.push(<div key={key++} className="h-4" />);
      } else if (trimmed.startsWith("### ")) {
        elements.push(
          <h3 key={key++} className="font-display text-lg font-semibold text-foreground mt-6 mb-2">
            {trimmed.slice(4)}
          </h3>
        );
      } else if (trimmed.startsWith("## ")) {
        elements.push(
          <h2 key={key++} className="font-display text-2xl font-bold text-foreground mt-8 mb-3">
            {trimmed.slice(3)}
          </h2>
        );
      } else if (/^\d+\.\s/.test(trimmed)) {
        elements.push(
          <p key={key++} className="font-body text-foreground/90 leading-relaxed pl-4">
            {trimmed}
          </p>
        );
      } else if (trimmed.startsWith("- **")) {
        const match = trimmed.match(/^- \*\*(.+?)\*\*:?\s*(.*)$/);
        if (match) {
          elements.push(
            <p key={key++} className="font-body text-foreground/90 leading-relaxed pl-4">
              • <strong className="font-semibold">{match[1]}</strong>{match[2] ? `: ${match[2]}` : ""}
            </p>
          );
        } else {
          elements.push(
            <p key={key++} className="font-body text-foreground/90 leading-relaxed pl-4">
              • {trimmed.slice(2)}
            </p>
          );
        }
      } else if (trimmed.startsWith("- ")) {
        elements.push(
          <p key={key++} className="font-body text-foreground/90 leading-relaxed pl-4">
            • {trimmed.slice(2)}
          </p>
        );
      } else {
        elements.push(
          <p key={key++} className="font-body text-foreground/90 leading-relaxed">
            {trimmed}
          </p>
        );
      }
    }
    return elements;
  };

  return (
    <article className="pb-16">
      {/* Hero image */}
      <div className="w-full h-64 md:h-96 overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 max-w-3xl">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mt-8 mb-4">
          <Badge variant="secondary" className="font-body">
            {article.category}
          </Badge>
          <span className="text-sm text-muted-foreground font-body flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {article.readTime}
          </span>
          <span className="text-sm text-muted-foreground font-body flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(article.date).toLocaleDateString()}
          </span>
          <span className="text-sm text-muted-foreground font-body flex items-center gap-1">
            <User className="h-3.5 w-3.5" /> {article.author}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
          {article.title}
        </h1>

        {/* Content */}
        <div className="prose-like space-y-1">
          {renderContent(article.content)}
        </div>
      </div>
    </article>
  );
};

export default BlogArticleView;
