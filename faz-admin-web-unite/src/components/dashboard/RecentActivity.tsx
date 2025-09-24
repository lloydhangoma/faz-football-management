import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ActivityItem {
  id: string;
  type: "transfer" | "club" | "ban" | "compliance" | "registration";
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  icon: LucideIcon;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case "transfer":
        return "bg-primary text-primary-foreground";
      case "club":
        return "bg-success text-success-foreground";
      case "ban":
        return "bg-destructive text-destructive-foreground";
      case "compliance":
        return "bg-warning text-warning-foreground";
      case "registration":
        return "bg-info text-info-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-card">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-card-foreground">Recent Activity</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent/50 transition-colors">
              <div className={cn("p-2 rounded-lg flex-shrink-0", getActivityColor(activity.type))}>
                <activity.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-card-foreground">{activity.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {activity.timestamp} • by {activity.actor}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button variant="ghost" className="text-primary">
            View All Activity
          </Button>
        </div>
      </div>
    </div>
  );
}