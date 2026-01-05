import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Search, MoreHorizontal, Users, MapPin, Edit, Trash2, Eye, 
  Calendar, Trophy, UserPlus, Image as ImageIcon, Save, X 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

// Team interface matching SAFA-style content
interface Team {
  id: string;
  name: string;
  nickname: string;
  category: "Senior" | "Youth" | "Futsal" | "Legends";
  type: "Men" | "Women";
  description: string;
  coach: string;
  coachImage?: string;
  homeGround: string;
  founded?: string;
  achievements: string[];
  currentRanking?: string;
  image?: string;
  upcomingMatch?: {
    opponent: string;
    date: string;
    competition: string;
  };
  recentResults: {
    opponent: string;
    score: string;
    result: "W" | "L" | "D";
  }[];
}

// Initial teams data for Zambian national teams
const initialTeams: Team[] = [
  {
    id: "1",
    name: "Chipolopolo",
    nickname: "The Copper Bullets",
    category: "Senior",
    type: "Men",
    description: "The Zambia national football team, nicknamed 'Chipolopolo' (The Copper Bullets), represents Zambia in men's international football. The team won the Africa Cup of Nations in 2012.",
    coach: "Avram Grant",
    homeGround: "National Heroes Stadium",
    founded: "1929",
    achievements: ["AFCON 2012 Champions", "COSAFA Cup Winners (x6)", "CECAFA Cup Winners"],
    currentRanking: "FIFA #89",
    upcomingMatch: {
      opponent: "Morocco",
      date: "Jan 15, 2025",
      competition: "AFCON Qualifiers"
    },
    recentResults: [
      { opponent: "Congo DR", score: "1-1", result: "D" },
      { opponent: "Tanzania", score: "2-0", result: "W" },
      { opponent: "Morocco", score: "0-1", result: "L" }
    ]
  },
  {
    id: "2",
    name: "Shepolopolo",
    nickname: "The Copper Queens",
    category: "Senior",
    type: "Women",
    description: "The Zambia women's national football team, nicknamed 'Shepolopolo' (The Copper Queens), made history by qualifying for the 2020 Olympics and the 2023 FIFA Women's World Cup.",
    coach: "Bruce Mwape",
    homeGround: "National Heroes Stadium",
    founded: "1990s",
    achievements: ["2020 Olympics Qualification", "2023 FIFA Women's World Cup", "COSAFA Women's Champions (x5)"],
    currentRanking: "FIFA #61",
    upcomingMatch: {
      opponent: "South Africa",
      date: "Jan 20, 2025",
      competition: "WAFCON Qualifiers"
    },
    recentResults: [
      { opponent: "Nigeria", score: "0-2", result: "L" },
      { opponent: "Morocco", score: "1-1", result: "D" },
      { opponent: "Cameroon", score: "2-1", result: "W" }
    ]
  },
  {
    id: "3",
    name: "Junior Chipolopolo (U20)",
    nickname: "Junior Copper Bullets",
    category: "Youth",
    type: "Men",
    description: "The Zambia U-20 national team represents the country in youth international competitions including the AFCON U-20 and FIFA U-20 World Cup qualifiers.",
    coach: "Chisi Mbewe",
    homeGround: "Nkoloma Stadium",
    achievements: ["COSAFA U20 Champions 2023", "AFCON U20 Participants"],
    upcomingMatch: {
      opponent: "Tanzania",
      date: "Feb 5, 2025",
      competition: "AFCON U20 Qualifiers"
    },
    recentResults: [
      { opponent: "Malawi", score: "3-0", result: "W" },
      { opponent: "Zimbabwe", score: "2-1", result: "W" }
    ]
  },
  {
    id: "4",
    name: "Junior Shepolopolo (U20)",
    nickname: "Junior Copper Queens",
    category: "Youth",
    type: "Women",
    description: "The Zambia U-20 women's national team competes in continental and regional youth competitions, developing the next generation of Shepolopolo stars.",
    coach: "Charles Kalumba",
    homeGround: "Nkoloma Stadium",
    achievements: ["COSAFA U20 Women Finalists 2023"],
    upcomingMatch: {
      opponent: "Malawi",
      date: "Feb 10, 2025",
      competition: "COSAFA U20 Women"
    },
    recentResults: [
      { opponent: "Botswana", score: "4-0", result: "W" }
    ]
  },
  {
    id: "5",
    name: "U17 Chipolopolo",
    nickname: "Young Copper Bullets",
    category: "Youth",
    type: "Men",
    description: "The Zambia U-17 national team focuses on developing young talent for future national team selection.",
    coach: "Osward Mutapa",
    homeGround: "Edwin Imboela Stadium",
    achievements: ["COSAFA U17 Participants"],
    recentResults: [
      { opponent: "Botswana", score: "2-0", result: "W" },
      { opponent: "Namibia", score: "3-1", result: "W" }
    ]
  },
  {
    id: "6",
    name: "U17 Shepolopolo",
    nickname: "Young Copper Queens",
    category: "Youth",
    type: "Women",
    description: "The Zambia U-17 women's team develops young female footballers for the senior national team pathway.",
    coach: "Beauty Mwamba",
    homeGround: "Edwin Imboela Stadium",
    achievements: ["COSAFA U17 Women Participants"],
    recentResults: []
  },
  {
    id: "7",
    name: "U15 Chipolopolo",
    nickname: "Future Copper Bullets",
    category: "Youth",
    type: "Men",
    description: "The youngest national team level, focusing on grassroots development and talent identification.",
    coach: "TBC",
    homeGround: "Independence Stadium",
    achievements: [],
    recentResults: []
  },
  {
    id: "8",
    name: "Zambia Futsal",
    nickname: "Futsal Chipolopolo",
    category: "Futsal",
    type: "Men",
    description: "The Zambia national futsal team competes in CAF and COSAFA futsal competitions.",
    coach: "Jerry Munthali",
    homeGround: "Olympic Youth Development Centre",
    achievements: ["COSAFA Futsal Participants"],
    upcomingMatch: {
      opponent: "Zimbabwe",
      date: "Feb 15, 2025",
      competition: "COSAFA Futsal"
    },
    recentResults: [
      { opponent: "Mozambique", score: "3-4", result: "L" }
    ]
  },
  {
    id: "9",
    name: "Zambia Legends",
    nickname: "The Legends",
    category: "Legends",
    type: "Men",
    description: "Former Zambia national team players who represent the country in legends and masters tournaments.",
    coach: "Kalusha Bwalya",
    homeGround: "Various",
    achievements: ["2012 AFCON Heroes", "Multiple International Legends Tournaments"],
    recentResults: [
      { opponent: "South Africa Legends", score: "2-2", result: "D" }
    ]
  }
];

const Teams = () => {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.nickname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const seniorTeams = filteredTeams.filter(t => t.category === "Senior");
  const youthTeams = filteredTeams.filter(t => t.category === "Youth");
  const otherTeams = filteredTeams.filter(t => t.category === "Futsal" || t.category === "Legends");

  const handleView = (team: Team) => {
    setSelectedTeam(team);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (team: Team) => {
    setEditingTeam({ ...team });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingTeam) {
      setTeams(teams.map(t => t.id === editingTeam.id ? editingTeam : t));
      setIsEditDialogOpen(false);
      setEditingTeam(null);
      toast({ title: "Team Updated", description: `${editingTeam.name} has been updated.` });
    }
  };

  const handleDelete = (team: Team) => {
    setTeams(teams.filter(t => t.id !== team.id));
    toast({ title: "Team Deleted", description: `${team.name} has been removed.` });
  };

  const getResultBadge = (result: "W" | "L" | "D") => {
    const styles = {
      W: "bg-success/10 text-success",
      L: "bg-destructive/10 text-destructive",
      D: "bg-warning/10 text-warning"
    };
    return <Badge className={styles[result]}>{result}</Badge>;
  };

  const renderTeamCard = (team: Team, index: number) => (
    <Card 
      key={team.id} 
      className="group hover:shadow-lg transition-all duration-300 animate-slide-up cursor-pointer"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-3xl">
              {team.type === "Women" ? "👩‍🦰" : "⚽"}
            </div>
            <div>
              <CardTitle className="text-lg">{team.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{team.nickname}</p>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline">{team.category}</Badge>
                <Badge variant="secondary">{team.type}</Badge>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleView(team)}>
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(team)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Team
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserPlus className="mr-2 h-4 w-4" /> Manage Squad
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="mr-2 h-4 w-4" /> View Fixtures
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDelete(team)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{team.description}</p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {team.coach}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {team.homeGround}
          </span>
        </div>

        {team.currentRanking && (
          <Badge className="bg-primary/10 text-primary">{team.currentRanking}</Badge>
        )}

        {team.upcomingMatch && (
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Next Match</p>
            <p className="text-sm font-medium">vs {team.upcomingMatch.opponent}</p>
            <p className="text-xs text-muted-foreground">{team.upcomingMatch.date} • {team.upcomingMatch.competition}</p>
          </div>
        )}

        {team.recentResults.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Recent Results</p>
            <div className="flex gap-2 flex-wrap">
              {team.recentResults.slice(0, 3).map((result, i) => (
                <div key={i} className="flex items-center gap-1 text-xs">
                  {getResultBadge(result.result)}
                  <span className="text-muted-foreground">{result.score}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout title="Teams" subtitle="Manage Zambian national teams content">
      {/* Actions Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search teams..." 
            className="pl-9" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Team
        </Button>
      </div>

      {/* Teams Tabs */}
      <Tabs defaultValue="senior" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="senior">Senior Teams ({seniorTeams.length})</TabsTrigger>
          <TabsTrigger value="youth">Youth Teams ({youthTeams.length})</TabsTrigger>
          <TabsTrigger value="other">Other Teams ({otherTeams.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="senior">
          <div className="grid gap-6 md:grid-cols-2">
            {seniorTeams.map((team, index) => renderTeamCard(team, index))}
          </div>
        </TabsContent>

        <TabsContent value="youth">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {youthTeams.map((team, index) => renderTeamCard(team, index))}
          </div>
        </TabsContent>

        <TabsContent value="other">
          <div className="grid gap-6 md:grid-cols-2">
            {otherTeams.map((team, index) => renderTeamCard(team, index))}
          </div>
        </TabsContent>
      </Tabs>

      {/* View Team Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedTeam && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                    {selectedTeam.type === "Women" ? "👩‍🦰" : "⚽"}
                  </div>
                  <div>
                    <span>{selectedTeam.name}</span>
                    <p className="text-sm font-normal text-muted-foreground">{selectedTeam.nickname}</p>
                  </div>
                </DialogTitle>
                <DialogDescription>{selectedTeam.description}</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Coach</p>
                    <p className="font-medium">{selectedTeam.coach}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Home Ground</p>
                    <p className="font-medium">{selectedTeam.homeGround}</p>
                  </div>
                  {selectedTeam.currentRanking && (
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Current Ranking</p>
                      <p className="font-medium">{selectedTeam.currentRanking}</p>
                    </div>
                  )}
                  {selectedTeam.founded && (
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Founded</p>
                      <p className="font-medium">{selectedTeam.founded}</p>
                    </div>
                  )}
                </div>

                {selectedTeam.achievements.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-primary" /> Achievements
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTeam.achievements.map((achievement, i) => (
                        <Badge key={i} variant="secondary">{achievement}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTeam.upcomingMatch && (
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" /> Upcoming Match
                    </h4>
                    <p className="text-lg font-semibold">{selectedTeam.name} vs {selectedTeam.upcomingMatch.opponent}</p>
                    <p className="text-sm text-muted-foreground">{selectedTeam.upcomingMatch.date} • {selectedTeam.upcomingMatch.competition}</p>
                  </div>
                )}

                {selectedTeam.recentResults.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Recent Results</h4>
                    <div className="space-y-2">
                      {selectedTeam.recentResults.map((result, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                          <span>vs {result.opponent}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{result.score}</span>
                            {getResultBadge(result.result)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                <Button onClick={() => { setIsViewDialogOpen(false); handleEdit(selectedTeam); }}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Team
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Team Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {editingTeam && (
            <>
              <DialogHeader>
                <DialogTitle>Edit Team</DialogTitle>
                <DialogDescription>Update team information and details</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Team Name</Label>
                    <Input 
                      id="name" 
                      value={editingTeam.name}
                      onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nickname">Nickname</Label>
                    <Input 
                      id="nickname" 
                      value={editingTeam.nickname}
                      onChange={(e) => setEditingTeam({ ...editingTeam, nickname: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={editingTeam.description}
                    onChange={(e) => setEditingTeam({ ...editingTeam, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="coach">Coach</Label>
                    <Input 
                      id="coach" 
                      value={editingTeam.coach}
                      onChange={(e) => setEditingTeam({ ...editingTeam, coach: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="homeGround">Home Ground</Label>
                    <Input 
                      id="homeGround" 
                      value={editingTeam.homeGround}
                      onChange={(e) => setEditingTeam({ ...editingTeam, homeGround: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={editingTeam.category} 
                      onValueChange={(value: Team["category"]) => setEditingTeam({ ...editingTeam, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Senior">Senior</SelectItem>
                        <SelectItem value="Youth">Youth</SelectItem>
                        <SelectItem value="Futsal">Futsal</SelectItem>
                        <SelectItem value="Legends">Legends</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select 
                      value={editingTeam.type} 
                      onValueChange={(value: Team["type"]) => setEditingTeam({ ...editingTeam, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Men">Men</SelectItem>
                        <SelectItem value="Women">Women</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ranking">Current Ranking (optional)</Label>
                    <Input 
                      id="ranking" 
                      value={editingTeam.currentRanking || ""}
                      onChange={(e) => setEditingTeam({ ...editingTeam, currentRanking: e.target.value })}
                      placeholder="e.g., FIFA #89"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="founded">Founded (optional)</Label>
                    <Input 
                      id="founded" 
                      value={editingTeam.founded || ""}
                      onChange={(e) => setEditingTeam({ ...editingTeam, founded: e.target.value })}
                      placeholder="e.g., 1929"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button onClick={handleSaveEdit}>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Teams;
