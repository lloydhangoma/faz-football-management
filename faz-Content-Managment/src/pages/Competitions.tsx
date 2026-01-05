import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Trophy, Calendar, Users, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const competitions = [
  {
    id: "1",
    name: "Premier Soccer League",
    type: "League",
    teams: 16,
    startDate: "Aug 2024",
    endDate: "May 2025",
    status: "active",
    currentRound: "Matchday 18",
  },
  {
    id: "2",
    name: "National Cup",
    type: "Cup",
    teams: 32,
    startDate: "Oct 2024",
    endDate: "May 2025",
    status: "active",
    currentRound: "Quarter Finals",
  },
  {
    id: "3",
    name: "League Cup",
    type: "Cup",
    teams: 16,
    startDate: "Jan 2025",
    endDate: "Apr 2025",
    status: "upcoming",
    currentRound: "Not Started",
  },
  {
    id: "4",
    name: "Super Cup",
    type: "Shield",
    teams: 2,
    startDate: "Jul 2024",
    endDate: "Jul 2024",
    status: "completed",
    currentRound: "Final",
  },
  {
    id: "5",
    name: "First Division",
    type: "League",
    teams: 18,
    startDate: "Aug 2024",
    endDate: "May 2025",
    status: "active",
    currentRound: "Matchday 16",
  },
  {
    id: "6",
    name: "Youth League U21",
    type: "League",
    teams: 12,
    startDate: "Sep 2024",
    endDate: "Jun 2025",
    status: "active",
    currentRound: "Matchday 12",
  },
];

const Competitions = () => {
  const statusStyles = {
    active: "bg-success/10 text-success",
    upcoming: "bg-info/10 text-info",
    completed: "bg-muted text-muted-foreground",
  };

  return (
    <DashboardLayout title="Competitions" subtitle="Manage leagues and tournaments">
      {/* Actions Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search competitions..." className="pl-9" />
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Competition
        </Button>
      </div>

      {/* Competitions Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {competitions.map((competition, index) => (
          <div 
            key={competition.id} 
            className="stat-card animate-slide-up"
            style={{ animationDelay: `${index * 75}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">{competition.name}</h3>
                  <span className={`badge-status ${statusStyles[competition.status as keyof typeof statusStyles]}`}>
                    {competition.status}
                  </span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Edit Competition</DropdownMenuItem>
                  <DropdownMenuItem>Manage Teams</DropdownMenuItem>
                  <DropdownMenuItem>View Standings</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  Teams
                </span>
                <span className="font-medium text-foreground">{competition.teams}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Duration
                </span>
                <span className="font-medium text-foreground">
                  {competition.startDate} - {competition.endDate}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Current: <span className="font-medium text-foreground">{competition.currentRound}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Competitions;
