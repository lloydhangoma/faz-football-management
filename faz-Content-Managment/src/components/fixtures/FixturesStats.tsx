import { Calendar, Clock, Trophy, CheckCircle, AlertCircle } from "lucide-react";
import { Fixture } from "./FixtureForm";

interface FixturesStatsProps {
  fixtures: Fixture[];
}

const FixturesStats = ({ fixtures }: FixturesStatsProps) => {
  const stats = {
    total: fixtures.length,
    live: fixtures.filter(f => f.status === "live").length,
    upcoming: fixtures.filter(f => f.status === "upcoming").length,
    completed: fixtures.filter(f => f.status === "completed").length,
    thisMonth: fixtures.filter(f => {
      const fixtureDate = new Date(f.date);
      const now = new Date();
      return fixtureDate.getMonth() === now.getMonth() && fixtureDate.getFullYear() === now.getFullYear();
    }).length,
  };

  const statCards = [
    {
      title: "Total Fixtures",
      value: stats.total,
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Live Now",
      value: stats.live,
      icon: AlertCircle,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Upcoming",
      value: stats.upcoming,
      icon: Clock,
      color: "text-info",
      bgColor: "bg-info/10",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "This Month",
      value: stats.thisMonth,
      icon: Trophy,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
      {statCards.map((stat) => (
        <div
          key={stat.title}
          className="stat-card flex items-center gap-3"
        >
          <div className={`rounded-lg p-2 ${stat.bgColor}`}>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FixturesStats;
