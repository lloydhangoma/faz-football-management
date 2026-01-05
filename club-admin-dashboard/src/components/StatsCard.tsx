import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  color: "blue" | "green" | "orange" | "red";
}

const colorVariants = {
  blue: "text-primary bg-primary/10 border border-primary/20",
  green: "text-success bg-success/10 border border-success/20",
  orange: "text-warning bg-warning/10 border border-warning/20",
  red: "text-destructive bg-destructive/10 border border-destructive/20",
};

export default function StatsCard({ title, value, subtitle, icon: Icon, color }: StatsCardProps) {
  return (
    <div className="bg-card rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className={`p-4 rounded-xl ${colorVariants[color]} shadow-md`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}