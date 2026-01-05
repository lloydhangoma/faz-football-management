import { useState } from "react";

import { Calendar, MapPin, Trophy, Users, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LeagueTable from "@/components/LeagueTable";

const matches = [
  {
    id: 1,
    homeTeam: "Zanaco FC",
    awayTeam: "Green Eagles FC",
    date: "2024-01-20",
    time: "15:00",
    venue: "Levy Mwanawasa Stadium",
    competition: "Super League",
    status: "Scheduled",
    round: "Matchday 15"
  },
  {
    id: 2,
    homeTeam: "Power Dynamos FC",
    awayTeam: "Nkana FC",
    date: "2024-01-18",
    time: "17:30",
    venue: "Arthur Davies Stadium",
    competition: "Super League",
    status: "Live",
    score: "1-1",
    round: "Matchday 15"
  },
  {
    id: 3,
    homeTeam: "Red Arrows FC",
    awayTeam: "Zanaco FC",
    date: "2024-01-15",
    time: "15:00",
    venue: "Nkoloma Stadium",
    competition: "Super League",
    status: "Completed",
    score: "2-0",
    round: "Matchday 14"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Live':
      return 'bg-success text-success-foreground';
    case 'Completed':
      return 'bg-muted text-muted-foreground';
    case 'Scheduled':
      return 'bg-primary text-primary-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export default function Matches() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showLeagueTable, setShowLeagueTable] = useState(false);

  const filteredMatches = matches.filter(match => {
    if (selectedFilter === "all") return true;
    return match.status.toLowerCase() === selectedFilter.toLowerCase();
  });

  return (
    <div className="flex-1">
      {/* Header */}
      <header className="bg-card border-b px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Match Management</h1>
            <p className="text-muted-foreground mt-1">Track and manage football matches across all competitions</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Calendar size={16} className="mr-2" />
            Schedule Match
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-8">
  {/* Stats Overview + League Table Card */}
  <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Upcoming Matches</p>
                  <p className="text-2xl font-bold text-foreground">8</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Calendar size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Live Matches</p>
                  <p className="text-2xl font-bold text-foreground">1</p>
                </div>
                <div className="p-3 rounded-lg bg-success/10 text-success">
                  <Clock size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-foreground">142</p>
                </div>
                <div className="p-3 rounded-lg bg-accent/10 text-accent">
                  <Trophy size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Venues</p>
                  <p className="text-2xl font-bold text-foreground">12</p>
                </div>
                <div className="p-3 rounded-lg bg-warning/10 text-warning">
                  <MapPin size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* League Table Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowLeagueTable((v) => !v)}>
            <CardContent className="p-6 flex flex-col items-center justify-center h-full">
              <Trophy size={32} className="mb-2 text-primary" />
              <p className="text-sm font-medium text-muted-foreground">League Table</p>
              <Button variant="outline" className="mt-2">{showLeagueTable ? "Hide" : "View"} League Table</Button>
            </CardContent>
          </Card>
        </div>

        {/* League Table Display */}
        {showLeagueTable && (
          <div className="mb-8">
            <LeagueTable />
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "all", label: "All Matches" },
            { key: "live", label: "Live" },
            { key: "scheduled", label: "Scheduled" },
            { key: "completed", label: "Completed" }
          ].map((filter) => (
            <Button
              key={filter.key}
              variant={selectedFilter === filter.key ? "default" : "outline"}
              onClick={() => setSelectedFilter(filter.key)}
              className={selectedFilter === filter.key ? "bg-primary hover:bg-primary/90" : ""}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Matches List */}
        <div className="space-y-4">
          {filteredMatches.map((match) => (
            <Card key={match.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    {/* Match Status Badge */}
                    <div className="flex flex-col items-center gap-2">
                      <Badge className={getStatusColor(match.status)}>
                        {match.status}
                      </Badge>
                      {match.status === 'Live' && (
                        <div className="flex items-center gap-1 text-xs text-success">
                          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                          LIVE
                        </div>
                      )}
                    </div>

                    {/* Teams */}
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <h3 className="font-semibold text-lg text-foreground">{match.homeTeam}</h3>
                        <p className="text-sm text-muted-foreground">Home</p>
                      </div>
                      
                      <div className="flex flex-col items-center gap-2 min-w-[80px]">
                        {match.score ? (
                          <div className="text-2xl font-bold text-foreground">
                            {match.score}
                          </div>
                        ) : (
                          <div className="text-lg font-medium text-muted-foreground">
                            {match.time}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          {new Date(match.date).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="text-left">
                        <h3 className="font-semibold text-lg text-foreground">{match.awayTeam}</h3>
                        <p className="text-sm text-muted-foreground">Away</p>
                      </div>
                    </div>
                  </div>

                  {/* Match Details */}
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <MapPin size={14} />
                        <span>{match.venue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Trophy size={14} />
                        <span>{match.competition}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users size={14} />
                        <span>{match.round}</span>
                      </div>
                    </div>
                    
                    <Button variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}