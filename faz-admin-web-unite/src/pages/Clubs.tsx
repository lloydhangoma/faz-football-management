import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Building2, MapPin, Phone, Mail, Users } from "lucide-react";

const clubsData = [
  {
    id: "1",
    name: "Nkana FC",
    location: "Kitwe",
    founded: "1935",
    status: "Active",
    players: 32,
    phone: "+260 977 123456",
    email: "info@nkanafc.zm",
    division: "Super League",
  },
  {
    id: "2",
    name: "Power Dynamos FC",
    location: "Kitwe",
    founded: "1971",
    status: "Active", 
    players: 28,
    phone: "+260 966 789012",
    email: "contact@powerdynamos.zm",
    division: "Super League",
  },
  {
    id: "3",
    name: "Zanaco FC",
    location: "Lusaka",
    founded: "1978",
    status: "Active",
    players: 35,
    phone: "+260 955 345678",
    email: "admin@zanacofc.zm",
    division: "Super League",
  },
  {
    id: "4",
    name: "Lusaka United FC",
    location: "Lusaka",
    founded: "2024",
    status: "Pending",
    players: 0,
    phone: "+260 944 567890",
    email: "info@lusakaunited.zm",
    division: "Division One",
  },
];

export default function Clubs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredClubs = clubsData.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || club.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success text-success-foreground";
      case "Pending":
        return "bg-warning text-warning-foreground";
      case "Suspended":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Club Directory</h1>
          <p className="text-muted-foreground">Manage and view all registered football clubs</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Register New Club
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search clubs..."
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
          <option value="Pending">Pending</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClubs.map((club) => (
          <div key={club.id} className="bg-card rounded-lg border border-border p-6 shadow-card hover:shadow-elevated transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">{club.name}</h3>
                  <p className="text-sm text-muted-foreground">{club.division}</p>
                </div>
              </div>
              <Badge className={getStatusColor(club.status)}>
                {club.status}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{club.location}</span>
                <span className="text-muted-foreground">• Founded {club.founded}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{club.players} registered players</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{club.phone}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground truncate">{club.email}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button variant="outline" size="sm" className="flex-1">
                View Details
              </Button>
              <Button variant="secondary" size="sm" className="flex-1">
                Manage
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredClubs.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-card-foreground mb-2">No clubs found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}