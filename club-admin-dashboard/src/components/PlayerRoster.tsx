import { Search, Plus, Eye, Edit, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const players = [
  {
    id: 1,
    name: "Moses Banda",
    age: 24,
    nrc: "123456789/1",
    position: "Forward",
    status: "Active",
    joined: "Jan 15, 2024",
    avatar: "/lovable-uploads/5c3ad949-b867-4e22-9eb2-abae8057b624.png"
  },
  {
    id: 2,
    name: "Patrick Mulenga",
    age: 27,
    nrc: "234567891/1",
    position: "Midfielder",
    status: "Banned",
    joined: "Mar 10, 2023",
    avatar: "/lovable-uploads/5c3ad949-b867-4e22-9eb2-abae8057b624.png"
  },
  {
    id: 3,
    name: "Kennedy Musonda",
    age: 22,
    nrc: "345678911/1",
    position: "Defender",
    status: "Active",
    joined: "Aug 5, 2024",
    avatar: "/lovable-uploads/5c3ad949-b867-4e22-9eb2-abae8057b624.png"
  },
];

export default function PlayerRoster() {
  const navigate = useNavigate();

  return (
    <div className="bg-card rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Player Roster</h2>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus size={16} className="mr-2" />
            Add Player
          </Button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search players..." 
              className="pl-10"
            />
          </div>
          <select className="px-3 py-2 border rounded-lg text-sm bg-background">
            <option>All Status</option>
            <option>Active</option>
            <option>Banned</option>
            <option>Injured</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>NRC</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {player.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p 
                        className="font-medium text-foreground hover:text-primary transition-colors cursor-pointer"
                        onClick={() => navigate(`/players/${player.id}`)}
                      >
                        {player.name}
                      </p>
                      <p className="text-sm text-muted-foreground">Age: {player.age}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{player.nrc}</TableCell>
                <TableCell className="text-muted-foreground">{player.position}</TableCell>
                <TableCell>
                  <Badge 
                    variant={player.status === 'Active' ? 'default' : 'destructive'}
                    className={player.status === 'Active' ? 'bg-success text-success-foreground' : ''}
                  >
                    {player.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{player.joined}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary hover:text-primary/80"
                      onClick={() => navigate(`/players/${player.id}`)}
                    >
                      <Eye size={14} className="mr-1" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                      <Edit size={14} className="mr-1" />
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing 1 to 3 of 24 results</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Previous</Button>
            <Button variant="default" size="sm" className="bg-primary">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}