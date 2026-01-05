import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Tag } from "lucide-react";

interface ArticlePreviewProps {
  title: string;
  content: string;
  author: string;
  category: string;
  type: string;
  featuredImage?: string;
  publishDate?: Date;
}

const ArticlePreview = ({
  title,
  content,
  author,
  category,
  type,
  featuredImage,
  publishDate,
}: ArticlePreviewProps) => {
  const excerpt = content
    .replace(/<[^>]*>/g, "")
    .slice(0, 150)
    .trim();

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/30">
        <h3 className="font-semibold text-sm text-muted-foreground">Preview</h3>
      </div>
      
      <div className="p-4">
        {/* Article Card Preview */}
        <div className="rounded-lg border border-border overflow-hidden bg-background">
          {featuredImage ? (
            <img
              src={featuredImage}
              alt={title || "Article"}
              className="w-full h-32 object-cover"
            />
          ) : (
            <div className="w-full h-32 bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-sm">No image</span>
            </div>
          )}
          
          <div className="p-4 space-y-3">
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-xs">
                {type || "News"}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {category || "General"}
              </Badge>
            </div>
            
            <h4 className="font-semibold line-clamp-2">
              {title || "Article Title"}
            </h4>
            
            <p className="text-sm text-muted-foreground line-clamp-2">
              {excerpt || "Article excerpt will appear here..."}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {author || "Author"}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {publishDate ? format(publishDate, "MMM d, yyyy") : "Date"}
              </span>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground text-center mt-4">
          This is how your article will appear on the public site
        </p>
      </div>
    </div>
  );
};

export default ArticlePreview;
