import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

const StatCard = ({ title, value, change, changeType = "neutral", icon: Icon, iconColor }: StatCardProps) => {
  const changeColors = {
    positive: "text-success",
    negative: "text-destructive",
    neutral: "text-muted-foreground",
  };

  return (
    <div className="stat-card animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 font-display text-3xl font-bold text-foreground">{value}</p>
          {change && (
            <p className={`mt-1 text-sm ${changeColors[changeType]}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`rounded-lg p-3 ${iconColor || "bg-primary/10"}`}>
          <Icon className={`h-6 w-6 ${iconColor ? "text-primary-foreground" : "text-primary"}`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
