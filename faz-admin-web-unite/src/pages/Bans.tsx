import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Shield, Search, Calendar, AlertTriangle, User, FileText } from "lucide-react";

const bansData = [
  {
    id: "1",
    playerName: "Collins Sikombe",
    clubName: "Nkana FC",
    reason: "Violent conduct",
    startDate: "2024-01-10",
    endDate: "2024-02-10",
    matches: 3,
    status: "Active",
    appealable: true,
    issuer: "Disciplinary Committee",
  },
  {
    id: "2",
    playerName: "John Banda",
    clubName: "Power Dynamos FC",
    reason: "Accumulation of yellow cards",
    startDate: "2024-01-15",
    endDate: "2024-01-22",
    matches: 1,
    status: "Active",
    appealable: false,
    issuer: "Match Commissioner",
  },
  {
    id: "3",
    playerName: "Moses Tembo",
    clubName: "Zanaco FC",
    reason: "Unsporting behavior",
    startDate: "2023-12-20",
    endDate: "2024-01-05",
    matches: 2,
    status: "Completed",
    appealable: false,
    issuer: "Disciplinary Committee",
  },
  {
    id: "4",
    playerName: "David Phiri",
    clubName: "Green Eagles FC",
    reason: "Use of offensive language",
    startDate: "2024-01-08",
    endDate: "2024-01-29",
    matches: 3,
    status: "Under Appeal",
    appealable: true,
    issuer: "Match Referee",
  },
  {
    id: "5",
    playerName: "Kennedy Mweene",
    clubName: "Lusaka Dynamos FC",
    reason: "Serious foul play",
    startDate: "2024-01-12",
    endDate: "2024-02-26",
    matches: 6,
    status: "Active",
    appealable: true,
    issuer: "Disciplinary Committee",
  },
];

export default function Bans() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredBans = bansData.filter(ban => {
    const matchesSearch = ban.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ban.clubName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ban.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || ban.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-destructive text-destructive-foreground";
      case "Under Appeal":
        return "bg-warning text-warning-foreground";
      case "Completed":
        return "bg-success text-success-foreground";
      case "Suspended":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getActionButton = (ban: typeof bansData[0]) => {
    switch (ban.status) {
      case "Active":
        return (
          <div className="flex gap-2">
            {ban.appealable && <Button variant="warning" size="sm">Appeal</Button>}
            <Button variant="destructive" size="sm">Extend</Button>
          </div>
        );
      case "Under Appeal":
        return <Button variant="default" size="sm">Review Appeal</Button>;
      case "Completed":
        return <Button variant="outline" size="sm">View Details</Button>;
      default:
        return <Button variant="outline" size="sm">Manage</Button>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bans & Sanctions</h1>
          <p className="text-muted-foreground">Manage player suspensions and disciplinary actions</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive">
            8 Active Bans
          </Badge>
          <Button className="gap-2">
            <Shield className="w-4 h-4" />
            Issue Ban
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-destructive" />
            <span className="text-sm font-medium text-muted-foreground">Active Bans</span>
          </div>
          <p className="text-2xl font-bold text-card-foreground mt-1">8</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <span className="text-sm font-medium text-muted-foreground">Under Appeal</span>
          </div>
          <p className="text-2xl font-bold text-card-foreground mt-1">1</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-info" />
            <span className="text-sm font-medium text-muted-foreground">Expiring Soon</span>
          </div>
          <p className="text-2xl font-bold text-card-foreground mt-1">3</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-success" />
            <span className="text-sm font-medium text-muted-foreground">This Month</span>
          </div>
          <p className="text-2xl font-bold text-card-foreground mt-1">12</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search players, clubs, reasons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select 
          className="bg-background border border-input rounded-md px-3 py-2 text-sm"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Under Appeal">Under Appeal</option>
          <option value="Completed">Completed</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      {/* Bans List */}
      <div className="space-y-4">
        {filteredBans.map((ban) => (
          <div key={ban.id} className="bg-card rounded-lg border border-border p-6 shadow-card">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-destructive" />
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-card-foreground text-lg">{ban.playerName}</h3>
                    <p className="text-sm text-muted-foreground">{ban.clubName}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">Reason:</span>
                      <span className="text-card-foreground font-medium">{ban.reason}</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(ban.startDate).toLocaleDateString()} - {new Date(ban.endDate).toLocaleDateString()}
                      </div>
                      <span>{ban.matches} match(es)</span>
                      <span>Issued by {ban.issuer}</span>
                    </div>
                    {ban.status === "Active" && getDaysRemaining(ban.endDate) > 0 && (
                      <div className="text-sm text-warning">
                        {getDaysRemaining(ban.endDate)} days remaining
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {ban.appealable && (
                      <Badge variant="outline" className="text-xs bg-info/10 text-info border-info/20">
                        Appealable
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Badge className={getStatusColor(ban.status)}>
                  {ban.status}
                </Badge>
                {getActionButton(ban)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBans.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-card-foreground mb-2">No bans found</h3>
          <p className="text-muted-foreground">No bans match your current search or filter criteria</p>
        </div>
      )}
    </div>
  );
}