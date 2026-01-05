import { Calendar, MapPin } from "lucide-react";

interface FixtureCardProps {
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  venue: string;
  competition: string;
  status: "upcoming" | "live" | "completed" | "postponed" | "cancelled";
}

const FixtureCard = ({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  date,
  time,
  venue,
  competition,
  status,
}: FixtureCardProps) => {
  const statusStyles: Record<string, string> = {
    upcoming: "bg-info/10 text-info",
    live: "bg-accent text-accent-foreground animate-pulse",
    completed: "bg-muted text-muted-foreground",
    postponed: "bg-warning/10 text-warning",
    cancelled: "bg-destructive/10 text-destructive",
  };

  const statusLabels: Record<string, string> = {
    upcoming: "Upcoming",
    live: "LIVE",
    completed: "FT",
    postponed: "Postponed",
    cancelled: "Cancelled",
  };

  return (
    <div className="stat-card">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-primary">{competition}</span>
        <span className={`badge-status ${statusStyles[status]}`}>
          {statusLabels[status]}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 text-center">
          <p className="font-display text-lg font-semibold text-foreground">{homeTeam}</p>
        </div>
        
        <div className="flex items-center gap-2">
          {status === "completed" || status === "live" ? (
            <>
              <span className="font-display text-2xl font-bold text-foreground">{homeScore}</span>
              <span className="text-muted-foreground">-</span>
              <span className="font-display text-2xl font-bold text-foreground">{awayScore}</span>
            </>
          ) : (
            <span className="font-display text-lg font-semibold text-muted-foreground">{time}</span>
          )}
        </div>
        
        <div className="flex-1 text-center">
          <p className="font-display text-lg font-semibold text-foreground">{awayTeam}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {date}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {venue}
        </span>
      </div>
    </div>
  );
};

export default FixtureCard;
