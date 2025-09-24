import { useState, useEffect } from "react";
import { Search, Plus, Clock, CheckCircle, XCircle, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const API_BASE_URL = "/api";

export default function Transfers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [newTransfer, setNewTransfer] = useState({
    playerId: "",
    toClub: "",
    amount: "",
    type: "Permanent"
  });
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get current club from localStorage
  let userClubId = "";
  let userClubName = "";
  try {
    const clubDataRaw = localStorage.getItem("clubData");
    if (clubDataRaw) {
      const clubData = JSON.parse(clubDataRaw);
      userClubId = clubData?.clubId || "";
      userClubName = clubData?.name || "";
    }
  } catch (e) {
    /* ignore parse errors */
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transfersRes, playersRes, clubsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/transfers`),
          fetch(`${API_BASE_URL}/players`),
          fetch(`${API_BASE_URL}/clubs`)
        ]);
        const transfersData = await transfersRes.json();
        const playersData = await playersRes.json();
        const clubsData = await clubsRes.json();
        setTransfers(transfersData);
        setPlayers(playersData);
        setClubs(clubsData);
      } catch (err) {
        setError("Failed to fetch transfers, players, or clubs.");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-success text-success-foreground';
      case 'Rejected': return 'bg-destructive text-destructive-foreground';
      case 'Pending': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle size={16} />;
      case 'Rejected': return <XCircle size={16} />;
      case 'Pending': return <Clock size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const filteredTransfers = transfers.filter(transfer => {
    const player = transfer.player || {};
    return (
      (player.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (player.nrc || "").includes(searchTerm) ||
      (transfer.fromClub?.clubName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transfer.toClub?.clubName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  const handleSubmitTransfer = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/transfers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify({
          playerId: newTransfer.playerId,
          toClub: newTransfer.toClub,
          amount: newTransfer.amount,
          type: newTransfer.type
        })
      });
      if (!res.ok) throw new Error("Failed to create transfer");
      const created = await res.json();
      setTransfers([created, ...transfers]);
      setIsDialogOpen(false);
      setNewTransfer({ playerId: "", toClub: "", amount: "", type: "Permanent" });
    } catch (err: any) {
      setError(err.message || "Failed to create transfer");
    }
  };

  // Incoming transfer requests for this club
  const incomingTransfers = transfers.filter(
    t => t.toClub === userClubName && t.status === "Pending"
  );
  
  // Accept/reject handlers
  const handleAccept = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/transfers/${id}/accept`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      if (!res.ok) throw new Error("Failed to accept transfer");
      const updated = await res.json();
      setTransfers(prev => prev.map(t => t._id === id ? updated : t));
    } catch (err) {
      setError("Failed to accept transfer");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/transfers/${id}/reject`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      if (!res.ok) throw new Error("Failed to reject transfer");
      const updated = await res.json();
      setTransfers(prev => prev.map(t => t._id === id ? updated : t));
    } catch (err) {
      setError("Failed to reject transfer");
    }
  };

  // Get player name and club name from fetched data
  const getPlayerDetails = (playerId) => {
    const player = players.find(p => p._id === playerId);
    return player ? `${player.name} (${player.nrc}) - ${player.club?.clubName || player.club}` : "Unknown Player";
  };
  
  // Get club name from fetched data
  const getClubName = (clubId) => {
    const club = clubs.find(c => c._id === clubId);
    return club ? club.clubName : "Unknown Club";
  };

  // Main JSX
  return (
    <div className="flex-1">
      <header className="bg-card border-b px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Transfer Management</h1>
            <p className="text-muted-foreground mt-1">Manage player transfers between clubs</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus size={16} className="mr-2" />
                Initiate New Transfer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Initiate New Transfer</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="playerId">Player</Label>
                  <select
                    id="playerId"
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-background"
                    value={newTransfer.playerId}
                    onChange={e => setNewTransfer({ ...newTransfer, playerId: e.target.value })}
                  >
                    <option value="">Select a player</option>
                    {players
                      .filter(player => (player.club?._id || player.club) === userClubId)
                      .map(player => (
                        <option key={player._id} value={player._id}>
                          {player.name} ({player.nrc})
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="toClub">Destination Club</Label>
                  <select
                    id="toClub"
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-background"
                    value={newTransfer.toClub}
                    onChange={e => setNewTransfer({ ...newTransfer, toClub: e.target.value })}
                  >
                    <option value="">Select destination club</option>
                    {clubs
                      .filter(club => club._id !== userClubId)
                      .map(club => (
                        <option key={club._id} value={club._id}>
                          {club.clubName}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="amount">Transfer Amount</Label>
                  <Input
                    id="amount"
                    placeholder="Enter transfer amount (e.g., K50,000)"
                    value={newTransfer.amount}
                    onChange={e => setNewTransfer({ ...newTransfer, amount: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Transfer Type</Label>
                  <select
                    id="type"
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-background"
                    value={newTransfer.type}
                    onChange={e => setNewTransfer({ ...newTransfer, type: e.target.value })}
                  >
                    <option value="Permanent">Permanent Transfer</option>
                    <option value="Loan">Loan Transfer</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleSubmitTransfer}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    Submit Transfer Request
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>
      {/* Incoming Transfer Requests Section */}
      {incomingTransfers.length > 0 && (
        <main className="flex-1 p-8">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Incoming Transfer Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incomingTransfers.map(transfer => {
                  const player = transfer.player || {};
                  return (
                    <div key={transfer._id} className="flex items-center justify-between p-6 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <ArrowRightLeft size={20} className="text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground text-lg">{player.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <span>NRC: {player.nrc}</span>
                            <span>•</span>
                            <span>{transfer.fromClub?.clubName || 'Unknown'} → {transfer.toClub?.clubName || 'Unknown'}</span>
                            <span>•</span>
                            <span>{transfer.amount}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={() => handleAccept(transfer._id)}>
                          Accept
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleReject(transfer._id)}>
                          Reject
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </main>
      )}
      {/* Content */}
      <main className="flex-1 p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Transfers</p>
                  <p className="text-2xl font-bold text-foreground">{transfers.filter(t => t.status === 'Pending').length}</p>
                </div>
                <div className="p-3 rounded-lg bg-warning/10 text-warning">
                  <Clock size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
          {/* ...other cards... */}
        </div>
        {/* Transfers Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Transfer Requests</CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search transfers..."
                    className="pl-10 w-80"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <select className="px-3 py-2 border rounded-lg text-sm bg-background">
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTransfers.map((transfer) => {
                const player = transfer.player || {};
                return (
                  <div key={transfer._id} className="flex items-center justify-between p-6 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <ArrowRightLeft size={20} className="text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">{player.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <span>NRC: {player.nrc}</span>
                          <span>•</span>
                          <span>{transfer.fromClub?.clubName || 'Unknown'} → {transfer.toClub?.clubName || 'Unknown'}</span>
                          <span>•</span>
                          <span>{transfer.amount}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className={getStatusColor(transfer.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(transfer.status)}
                            {transfer.status}
                          </div>
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(transfer.requestDate).toLocaleDateString()}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}