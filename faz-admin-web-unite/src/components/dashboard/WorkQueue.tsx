import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkQueueItem {
  id: string;
  title: string;
  description: string;
  count: number;
  icon: LucideIcon;
  iconColor: "primary" | "success" | "warning" | "destructive";
  actionLabel: string;
  actionVariant?: "default" | "destructive" | "warning" | "success" | "info";
}

interface WorkQueueProps {
  title: string;
  items: WorkQueueItem[];
}

export default function WorkQueue({ title, items }: WorkQueueProps) {
  const iconColors = {
    primary: "bg-primary text-primary-foreground",
    success: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground",
    destructive: "bg-destructive text-destructive-foreground",
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-card">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
      </div>
      <div className="p-6 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={cn("p-2 rounded-lg", iconColors[item.iconColor])}>
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-card-foreground">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
            <Button variant={item.actionVariant || "default"} size="sm">
              {item.actionLabel}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}