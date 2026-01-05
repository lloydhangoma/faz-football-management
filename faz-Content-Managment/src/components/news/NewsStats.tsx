import { FileText, Send, Clock, Archive } from "lucide-react";

interface NewsStatsProps {
  total: number;
  published: number;
  drafts: number;
  scheduled: number;
}

const NewsStats = ({ total, published, drafts, scheduled }: NewsStatsProps) => {
  const stats = [
    {
      label: "Total Articles",
      value: total,
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Published",
      value: published,
      icon: Send,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Drafts",
      value: drafts,
      icon: Archive,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    },
    {
      label: "Scheduled",
      value: scheduled,
      icon: Clock,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card rounded-xl p-4 border border-border"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsStats;
