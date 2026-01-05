import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface ScheduledArticle {
  id: string;
  title: string;
  date: string;
  status: "published" | "draft" | "scheduled";
}

interface ContentCalendarProps {
  articles: ScheduledArticle[];
  onDateSelect?: (date: Date) => void;
}

const ContentCalendar = ({ articles, onDateSelect }: ContentCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const scheduledArticles = articles.filter((a) => a.status === "scheduled");
  const publishedArticles = articles.filter((a) => a.status === "published");

  const getArticlesForDate = (date: Date) => {
    return articles.filter((article) => {
      // Parse the date string to compare
      const articleDate = new Date(article.date);
      return isSameDay(articleDate, date);
    });
  };

  const selectedDateArticles = selectedDate ? getArticlesForDate(selectedDate) : [];

  const modifiers = {
    scheduled: scheduledArticles.map((a) => new Date(a.date)),
    published: publishedArticles.map((a) => new Date(a.date)),
  };

  const modifiersStyles = {
    scheduled: {
      backgroundColor: "hsl(var(--accent) / 0.2)",
      color: "hsl(var(--accent))",
      fontWeight: "bold",
    },
    published: {
      backgroundColor: "hsl(var(--primary) / 0.2)",
      color: "hsl(var(--primary))",
      fontWeight: "bold",
    },
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/30">
        <h3 className="font-semibold">Content Calendar</h3>
        <p className="text-xs text-muted-foreground mt-1">
          View scheduled and published content
        </p>
      </div>

      <div className="p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date);
            if (date && onDateSelect) {
              onDateSelect(date);
            }
          }}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          className="rounded-md border pointer-events-auto"
        />

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary/20" />
            <span>Published</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-accent/20" />
            <span>Scheduled</span>
          </div>
        </div>

        {/* Selected date articles */}
        {selectedDate && (
          <div className="mt-4 pt-4 border-t border-border">
            <h4 className="text-sm font-medium mb-2">
              {format(selectedDate, "MMMM d, yyyy")}
            </h4>
            {selectedDateArticles.length > 0 ? (
              <div className="space-y-2">
                {selectedDateArticles.map((article) => (
                  <div
                    key={article.id}
                    className="p-2 rounded-lg bg-muted/50 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={article.status === "published" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {article.status}
                      </Badge>
                      <span className="line-clamp-1">{article.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No articles for this date</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentCalendar;
