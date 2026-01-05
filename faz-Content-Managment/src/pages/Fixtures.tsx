import { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import FixtureCard from "@/components/dashboard/FixtureCard";
import FixtureForm, { Fixture } from "@/components/fixtures/FixtureForm";
import FixturesStats from "@/components/fixtures/FixturesStats";
import FixturesTable from "@/components/fixtures/FixturesTable";
import FixturesBulkActions from "@/components/fixtures/FixturesBulkActions";
import FixturesCalendar from "@/components/fixtures/FixturesCalendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, CalendarDays, LayoutGrid, Table as TableIcon, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Initial fixtures data for Zambian national teams
const initialFixtures: Fixture[] = [
  {
    id: "1",
    homeTeam: "Chipolopolo (Men)",
    awayTeam: "Morocco",
    date: "Jan 15, 2025",
    time: "15:00",
    venue: "National Heroes Stadium",
    competition: "AFCON Qualifiers",
    status: "upcoming",
    tvBroadcast: "SuperSport",
    ticketStatus: "available",
  },
  {
    id: "2",
    homeTeam: "Shepolopolo (Women)",
    awayTeam: "South Africa",
    date: "Jan 20, 2025",
    time: "15:00",
    venue: "National Heroes Stadium",
    competition: "WAFCON Qualifiers",
    status: "upcoming",
    ticketStatus: "available",
  },
  {
    id: "3",
    homeTeam: "Chipolopolo (U20 Men)",
    awayTeam: "Tanzania",
    date: "Feb 5, 2025",
    time: "14:00",
    venue: "Nkoloma Stadium",
    competition: "AFCON U20 Qualifiers",
    status: "upcoming",
    ticketStatus: "not-on-sale",
  },
  {
    id: "4",
    homeTeam: "Shepolopolo (U20 Women)",
    awayTeam: "Malawi",
    date: "Feb 10, 2025",
    time: "15:00",
    venue: "Nkoloma Stadium",
    competition: "COSAFA U20 Women",
    status: "upcoming",
  },
  {
    id: "5",
    homeTeam: "Futsal National Team",
    awayTeam: "Zimbabwe",
    date: "Feb 15, 2025",
    time: "18:00",
    venue: "OYDC",
    competition: "COSAFA Futsal",
    status: "upcoming",
  },
  {
    id: "6",
    homeTeam: "Chipolopolo (U17 Men)",
    awayTeam: "Botswana",
    homeScore: 2,
    awayScore: 0,
    date: "Dec 29, 2024",
    time: "15:00",
    venue: "Edwin Imboela Stadium",
    competition: "COSAFA U17",
    status: "live",
  },
  {
    id: "7",
    homeTeam: "Chipolopolo (Men)",
    awayTeam: "Congo DR",
    homeScore: 1,
    awayScore: 1,
    date: "Nov 19, 2024",
    time: "15:00",
    venue: "National Heroes Stadium",
    competition: "AFCON Qualifiers",
    status: "completed",
    referee: "Victor Gomes",
  },
  {
    id: "8",
    homeTeam: "Shepolopolo (Women)",
    awayTeam: "Nigeria",
    homeScore: 0,
    awayScore: 2,
    date: "Oct 28, 2024",
    time: "16:00",
    venue: "National Heroes Stadium",
    competition: "Olympics Qualifiers",
    status: "completed",
  },
  {
    id: "9",
    homeTeam: "Chipolopolo (U17 Men)",
    awayTeam: "Namibia",
    homeScore: 3,
    awayScore: 1,
    date: "Dec 20, 2024",
    time: "14:00",
    venue: "Edwin Imboela Stadium",
    competition: "COSAFA U17",
    status: "completed",
  },
  {
    id: "10",
    homeTeam: "Legends / Masters",
    awayTeam: "South Africa Legends",
    homeScore: 2,
    awayScore: 2,
    date: "Dec 15, 2024",
    time: "15:00",
    venue: "Levy Mwanawasa Stadium",
    competition: "Legends Invitational",
    status: "completed",
  },
];

const Fixtures = () => {
  const [fixtures, setFixtures] = useState<Fixture[]>(initialFixtures);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [competitionFilter, setCompetitionFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingFixture, setEditingFixture] = useState<Fixture | null>(null);

  // Get unique competitions for filter
  const competitions = useMemo(() => {
    return [...new Set(fixtures.map(f => f.competition))];
  }, [fixtures]);

  // Get unique teams for filter
  const teams = useMemo(() => {
    return [...new Set(fixtures.map(f => f.homeTeam))];
  }, [fixtures]);

  // Filter fixtures
  const filteredFixtures = useMemo(() => {
    return fixtures.filter((fixture) => {
      const matchesSearch =
        fixture.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fixture.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fixture.competition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fixture.venue.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || fixture.status === statusFilter;
      const matchesCompetition = competitionFilter === "all" || fixture.competition === competitionFilter;
      const matchesTeam = teamFilter === "all" || fixture.homeTeam === teamFilter;

      return matchesSearch && matchesStatus && matchesCompetition && matchesTeam;
    });
  }, [fixtures, searchQuery, statusFilter, competitionFilter, teamFilter]);

  // Group fixtures by status
  const fixturesByStatus = useMemo(() => ({
    live: filteredFixtures.filter(f => f.status === "live"),
    upcoming: filteredFixtures.filter(f => f.status === "upcoming"),
    completed: filteredFixtures.filter(f => f.status === "completed"),
  }), [filteredFixtures]);

  const handleSaveFixture = (fixture: Fixture) => {
    setFixtures(prev => {
      const index = prev.findIndex(f => f.id === fixture.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = fixture;
        return updated;
      }
      return [...prev, fixture];
    });
    setEditingFixture(null);
  };

  const handleEdit = (fixture: Fixture) => {
    setEditingFixture(fixture);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setFixtures(prev => prev.filter(f => f.id !== id));
    setSelectedIds(prev => prev.filter(i => i !== id));
    toast.success("Fixture deleted");
  };

  const handleDuplicate = (fixture: Fixture) => {
    const newFixture: Fixture = {
      ...fixture,
      id: crypto.randomUUID(),
      status: "upcoming",
      homeScore: undefined,
      awayScore: undefined,
    };
    setFixtures(prev => [...prev, newFixture]);
    toast.success("Fixture duplicated");
  };

  const handleBulkStatusChange = (status: string) => {
    setFixtures(prev =>
      prev.map(f =>
        selectedIds.includes(f.id) ? { ...f, status: status as Fixture["status"] } : f
      )
    );
    setSelectedIds([]);
    toast.success(`Updated ${selectedIds.length} fixtures`);
  };

  const handleBulkDelete = () => {
    setFixtures(prev => prev.filter(f => !selectedIds.includes(f.id)));
    toast.success(`Deleted ${selectedIds.length} fixtures`);
    setSelectedIds([]);
  };

  const handleExport = () => {
    const dataToExport = selectedIds.length > 0
      ? fixtures.filter(f => selectedIds.includes(f.id))
      : fixtures;
    
    const csv = [
      ["Home Team", "Away Team", "Competition", "Date", "Time", "Venue", "Status", "Home Score", "Away Score"].join(","),
      ...dataToExport.map(f =>
        [f.homeTeam, f.awayTeam, f.competition, f.date, f.time, f.venue, f.status, f.homeScore ?? "", f.awayScore ?? ""].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fixtures.csv";
    a.click();
    toast.success("Fixtures exported");
  };

  return (
    <DashboardLayout title="Fixtures" subtitle="Manage national team match schedules">
      {/* Stats */}
      <div className="mb-6">
        <FixturesStats fixtures={fixtures} />
      </div>

      {/* Actions Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search fixtures..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={teamFilter} onValueChange={setTeamFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              {teams.map(team => (
                <SelectItem key={team} value={team}>{team}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={competitionFilter} onValueChange={setCompetitionFilter}>
            <SelectTrigger className="w-48">
              <CalendarDays className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Competition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Competitions</SelectItem>
              {competitions.map(comp => (
                <SelectItem key={comp} value={comp}>{comp}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-r-none"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-l-none"
              onClick={() => setViewMode("table")}
            >
              <TableIcon className="h-4 w-4" />
            </Button>
          </div>

          <Button onClick={() => { setEditingFixture(null); setFormOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Fixture
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="mb-4">
          <FixturesBulkActions
            selectedCount={selectedIds.length}
            onStatusChange={handleBulkStatusChange}
            onDelete={handleBulkDelete}
            onExport={handleExport}
          />
        </div>
      )}

      {/* Fixtures Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="live" className="gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
            </span>
            Live ({fixturesByStatus.live.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({fixturesByStatus.upcoming.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({fixturesByStatus.completed.length})</TabsTrigger>
          <TabsTrigger value="all">All ({filteredFixtures.length})</TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <Calendar className="h-4 w-4" />
            Calendar
          </TabsTrigger>
        </TabsList>

        {/* Live Tab */}
        <TabsContent value="live">
          {viewMode === "grid" ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {fixturesByStatus.live.map((fixture) => (
                <div key={fixture.id} onClick={() => handleEdit(fixture)} className="cursor-pointer">
                  <FixtureCard {...fixture} />
                </div>
              ))}
            </div>
          ) : (
            <FixturesTable
              fixtures={fixturesByStatus.live}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />
          )}
          {fixturesByStatus.live.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
              <p className="text-muted-foreground">No live matches at the moment</p>
            </div>
          )}
        </TabsContent>

        {/* Upcoming Tab */}
        <TabsContent value="upcoming">
          {viewMode === "grid" ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {fixturesByStatus.upcoming.map((fixture) => (
                <div key={fixture.id} onClick={() => handleEdit(fixture)} className="cursor-pointer">
                  <FixtureCard {...fixture} />
                </div>
              ))}
            </div>
          ) : (
            <FixturesTable
              fixtures={fixturesByStatus.upcoming}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />
          )}
        </TabsContent>

        {/* Completed Tab */}
        <TabsContent value="completed">
          {viewMode === "grid" ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {fixturesByStatus.completed.map((fixture) => (
                <div key={fixture.id} onClick={() => handleEdit(fixture)} className="cursor-pointer">
                  <FixtureCard {...fixture} />
                </div>
              ))}
            </div>
          ) : (
            <FixturesTable
              fixtures={fixturesByStatus.completed}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />
          )}
        </TabsContent>

        {/* All Tab */}
        <TabsContent value="all">
          {viewMode === "grid" ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredFixtures.map((fixture) => (
                <div key={fixture.id} onClick={() => handleEdit(fixture)} className="cursor-pointer">
                  <FixtureCard {...fixture} />
                </div>
              ))}
            </div>
          ) : (
            <FixturesTable
              fixtures={filteredFixtures}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />
          )}
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar">
          <FixturesCalendar fixtures={fixtures} onSelectFixture={handleEdit} />
        </TabsContent>
      </Tabs>

      {/* Fixture Form Dialog */}
      <FixtureForm
        open={formOpen}
        onOpenChange={setFormOpen}
        fixture={editingFixture}
        onSave={handleSaveFixture}
      />
    </DashboardLayout>
  );
};

export default Fixtures;
