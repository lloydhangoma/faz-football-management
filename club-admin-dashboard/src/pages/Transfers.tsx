import { useState, useEffect, useCallback } from "react";
import { Search, Plus, Clock, CheckCircle, XCircle, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import TransferDetailsModal from "@/components/TransferDetailsModal";

const API_BASE_URL = "/api";

export default function Transfers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transfers, setTransfers] = useState([]);
  const [players, setPlayers] = useState([]);
  const [newTransfer, setNewTransfer] = useState({
    playerId: "",
    toClub: "",
    amount: "",
    type: "Permanent",
    contractLength: "",
    salary: "",
    releaseClause: "",
    agentFee: "",
    transferWindow: "",
    deadline: ""
  });
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [userClubId, setUserClubId] = useState("");
  const [userClubName, setUserClubName] = useState("");

  const [counterOfferTransfer, setCounterOfferTransfer] = useState(null);
  const [counterOfferAmount, setCounterOfferAmount] = useState("");
  
  // Transfer details modal state
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Helper function for API calls with JWT authentication
  const fetchWithAuth = useCallback(async (url, options = {}) => {
    const token = localStorage.getItem("jwt");
    if (!token || token === "undefined" || token === "null" || token.trim() === "") {
      localStorage.removeItem("jwt");
      localStorage.removeItem("clubData");
      console.error("Invalid JWT token in localStorage. Redirecting to login.");
      window.location.href = "/";
      return;
    }
    const headers = {
      ...((options as any).headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const response = await fetch(url, { ...options, headers });
    if (response.status === 403) {
      setError("Forbidden access. You may not have the necessary permissions.");
    }
    return response;
  }, []);

  // Reusable function to fetch all data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [transfersRes, playersRes, clubsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/transfers`),
        fetchWithAuth(`${API_BASE_URL}/players`),
        fetch(`${API_BASE_URL}/clubs`)
      ]);

      console.log("Transfers response:", transfersRes.status);
      console.log("Players response:", playersRes?.status);
      console.log("Clubs response:", clubsRes?.status);

      if (!transfersRes?.ok || !playersRes?.ok || !clubsRes?.ok) {
        throw new Error("Failed to fetch initial data.");
      }

      const transfersData = await transfersRes.json();
      const playersData = await playersRes.json();
      const clubsData = await clubsRes.json();

      console.log("Players data:", playersData);
      console.log("Players array length:", Array.isArray(playersData) ? playersData.length : (playersData.players ? playersData.players.length : 'N/A'));

      // Handle different response formats
      const playersArray = Array.isArray(playersData) ? playersData : (playersData.players || []);

      setTransfers(transfersData);
      setPlayers(playersArray);
      setClubs(clubsData);
    } catch (err) {
      setError("Failed to fetch transfers, players, or clubs.");
      console.error("Fetch error:", err);
    }
    setLoading(false);
  }, [fetchWithAuth]);

  // Combined effect to get club data from localStorage and fetch all other data
  useEffect(() => {
    try {
      const clubDataRaw = localStorage.getItem("clubData");
      if (clubDataRaw) {
        const clubData = JSON.parse(clubDataRaw);
        setUserClubId(clubData?.id || "");  // Changed from clubId to id
        setUserClubName(clubData?.name || "");
        console.log("Loaded club data:", clubData);
        console.log("User club ID set to:", clubData?.id);
      } else {
        console.log("No club data found in localStorage");
      }
    } catch (err) {
      console.error("Failed to parse club data from localStorage", err);
    }

    fetchData();
  }, [fetchData]);

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-success text-success-foreground';
      case 'Rejected': return 'bg-destructive text-destructive-foreground';
      case 'Pending': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  const getStatusIcon = (status) => {
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
      console.log("Submitting transfer with data:", {
        playerId: newTransfer.playerId,
        toClub: newTransfer.toClub,
        amount: newTransfer.amount,
        type: newTransfer.type,
        contractLength: newTransfer.contractLength,
        salary: newTransfer.salary,
        releaseClause: newTransfer.releaseClause,
        agentFee: newTransfer.agentFee,
        transferWindow: newTransfer.transferWindow,
        deadline: newTransfer.deadline
      });

      const res = await fetchWithAuth(`${API_BASE_URL}/transfers`, {
        method: "POST",
        body: JSON.stringify({
          playerId: newTransfer.playerId,
          toClub: newTransfer.toClub,
          amount: newTransfer.amount,
          type: newTransfer.type,
          contractLength: newTransfer.contractLength,
          salary: newTransfer.salary,
          releaseClause: newTransfer.releaseClause,
          agentFee: newTransfer.agentFee,
          transferWindow: newTransfer.transferWindow,
          deadline: newTransfer.deadline
        })
      });

      console.log("Transfer creation response status:", res?.status);

      if (!res?.ok) {
        if (res) {
          const errorText = await res.text();
          console.error("Transfer creation failed:", res.status, errorText);
          setError(`Failed to create transfer: ${errorText}`);
          throw new Error(`Failed to create transfer: ${errorText}`);
        }
        return; // Exit if fetchWithAuth failed
      }

      const result = await res.json();
      console.log("Transfer created successfully:", result);

      setIsDialogOpen(false);
      setNewTransfer({ playerId: "", toClub: "", amount: "", type: "Permanent", contractLength: "", salary: "", releaseClause: "", agentFee: "", transferWindow: "", deadline: "" });
      fetchData(); // Refresh data after a successful creation
      setError(""); // Clear any previous errors
    } catch (err: any) {
      console.error("Transfer submission error:", err);
      setError(`Failed to create transfer: ${err.message}`);
    }
  };

  // Incoming transfer requests for this club
  const incomingTransfers = transfers.filter(
    t => t.toClub?._id === userClubId && t.status === "Pending"
  );
  
  // Accept/reject handlers
  const handleAccept = async (id) => {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/transfers/${id}/accept`, {
        method: "PUT",
      });
      if (!res?.ok) {
        if (res) throw new Error("Failed to accept transfer");
        return;
      }
      fetchData(); // Refresh data after a successful action
    } catch (err) {
      setError("Failed to accept transfer.");
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/transfers/${id}/reject`, {
        method: "PUT",
      });
      if (!res?.ok) {
        if (res) throw new Error("Failed to reject transfer");
        return;
      }
      fetchData(); // Refresh data after a successful action
    } catch (err) {
      setError("Failed to reject transfer.");
    }
  };

  const handleCounterOffer = async () => {
    if (!counterOfferTransfer || !counterOfferAmount) return;
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/transfers/${counterOfferTransfer._id}/counter-offer`, {
        method: "PUT",
        body: JSON.stringify({ amount: parseFloat(counterOfferAmount) })
      });
      if (!res?.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      setCounterOfferTransfer(null);
      setCounterOfferAmount('');
      fetchData();
    } catch (err) {
      setError("Failed to submit counter-offer.");
    }
  };

  // Modal handlers
  const handleViewDetails = (transfer) => {
    setSelectedTransfer(transfer);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setSelectedTransfer(null);
    setIsDetailsModalOpen(false);
  };

  const handleModalCounterOffer = async (transfer, amount) => {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/transfers/${transfer._id}/counter-offer`, {
        method: "PUT",
        body: JSON.stringify({ amount: parseFloat(amount) })
      });
      if (!res?.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      fetchData();
      // Update the selected transfer to reflect changes
      const updatedTransfers = await fetch(`${API_BASE_URL}/transfers`);
      const transfersData = await updatedTransfers.json();
      const updatedTransfer = transfersData.find(t => t._id === transfer._id);
      setSelectedTransfer(updatedTransfer);
    } catch (err) {
      setError("Failed to submit counter-offer.");
    }
  };

  const handleAcceptCounter = async (id) => {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/transfers/${id}/accept-counter`, {
        method: "PUT",
      });
      if (!res?.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      fetchData();
    } catch (err) {
      setError("Failed to accept counter-offer.");
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
  // Filter players to only show active players who can be transferred
  const filteredPlayers = Array.isArray(players) ? players.filter(player =>
    player.status === 'Active' || player.currentStatus?.registrationStatus === 'Active'
  ) : [];

  console.log("All players:", players);
  console.log("Filtered players for transfer:", filteredPlayers.length);
  console.log("User club ID:", userClubId);
  
  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-destructive">{error}</div>;

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
                    <option value="none">Select a player</option>
                    {filteredPlayers.length > 0 ? (
                      filteredPlayers.map(player => (
                        <option key={player._id} value={player._id}>
                          {player.name} ({player.nrc}) - {player.position}
                        </option>
                      ))
                    ) : (
                      <option value="none" disabled>
                        {loading ? 'Loading players...' : 'No active players available for transfer'}
                      </option>
                    )}
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
                    <option value="none">Select destination club</option>
                    {Array.isArray(clubs) && clubs
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
                <div>
                  <Label htmlFor="contractLength">Contract Length (Years)</Label>
                  <Input
                    id="contractLength"
                    type="number"
                    placeholder="Enter contract length in years"
                    value={newTransfer.contractLength}
                    onChange={e => setNewTransfer({ ...newTransfer, contractLength: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="salary">Salary</Label>
                  <Input
                    id="salary"
                    placeholder="Enter salary amount (e.g., K50,000)"
                    value={newTransfer.salary}
                    onChange={e => setNewTransfer({ ...newTransfer, salary: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="releaseClause">Release Clause</Label>
                  <Input
                    id="releaseClause"
                    placeholder="Enter release clause amount"
                    value={newTransfer.releaseClause}
                    onChange={e => setNewTransfer({ ...newTransfer, releaseClause: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="agentFee">Agent Fee</Label>
                  <Input
                    id="agentFee"
                    placeholder="Enter agent fee amount"
                    value={newTransfer.agentFee}
                    onChange={e => setNewTransfer({ ...newTransfer, agentFee: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="transferWindow">Transfer Window</Label>
                  <select
                    id="transferWindow"
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-background"
                    value={newTransfer.transferWindow}
                    onChange={e => setNewTransfer({ ...newTransfer, transferWindow: e.target.value })}
                  >
                    <option value="none">Select transfer window</option>
                    <option value="Summer">Summer</option>
                    <option value="Winter">Winter</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newTransfer.deadline}
                    onChange={e => setNewTransfer({ ...newTransfer, deadline: e.target.value })}
                  />
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
          <Dialog open={!!counterOfferTransfer} onOpenChange={() => setCounterOfferTransfer(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Submit Counter-Offer</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="counterAmount">Counter-Offer Amount</Label>
                  <Input
                    id="counterAmount"
                    placeholder="Enter amount (e.g., 50000)"
                    value={counterOfferAmount}
                    onChange={e => setCounterOfferAmount(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleCounterOffer}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    Submit Counter-Offer
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCounterOfferTransfer(null)}
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
                      <div className="flex items-center gap-3">
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleAccept(transfer._id)}>Accept</Button>
                          <Button size="sm" variant="outline" onClick={() => handleReject(transfer._id)}>Reject</Button>
                          <Button size="sm" variant="outline" onClick={() => setCounterOfferTransfer(transfer)}>Counter-Offer</Button>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(transfer)}
                        >
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
                  <div key={transfer._id}>
                    <div className="flex items-center justify-between p-6 border rounded-lg hover:bg-muted/50 transition-colors">
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
                          <div className="flex gap-2 mt-2">
                            {userClubId === transfer.toClub._id && transfer.status === 'Pending' && (
                              <>
                                <Button size="sm" onClick={() => handleAccept(transfer._id)}>Accept</Button>
                                <Button size="sm" variant="outline" onClick={() => handleReject(transfer._id)}>Reject</Button>
                                <Button size="sm" variant="outline" onClick={() => setCounterOfferTransfer(transfer)}>Counter-Offer</Button>
                              </>
                            )}
                            {userClubId === transfer.fromClub._id && transfer.status === 'CounterOffered' && (
                              <Button size="sm" onClick={() => handleAcceptCounter(transfer._id)}>Accept Counter</Button>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(transfer)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                    <div className="ml-18 mt-4">
                      <h4 className="text-sm font-semibold mb-2">Transfer Timeline</h4>
                      <div className="border-l-2 border-muted pl-4">
                        <div className="flex items-start mb-2">
                          <div className="w-3 h-3 bg-primary rounded-full mt-1 mr-3"></div>
                          <div>
                            <p className="text-sm">Transfer requested for {transfer.amount}</p>
                            <p className="text-xs text-muted-foreground">{new Date(transfer.requestDate).toLocaleString()}</p>
                          </div>
                        </div>
                        {transfer.counterOffers.map((co, idx) => (
                          <div key={idx} className="flex items-start mb-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mt-1 mr-3"></div>
                            <div>
                              <p className="text-sm">Counter-offer: {co.amount}</p>
                              <p className="text-xs text-muted-foreground">{new Date(co.timestamp).toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                        {transfer.status === 'Approved' && (
                          <div className="flex items-start mb-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full mt-1 mr-3"></div>
                            <div>
                              <p className="text-sm">Transfer approved</p>
                              <p className="text-xs text-muted-foreground">{new Date(transfer.approvalDate || transfer.updatedAt).toLocaleString()}</p>
                            </div>
                          </div>
                        )}
                        {transfer.status === 'Rejected' && (
                          <div className="flex items-start mb-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full mt-1 mr-3"></div>
                            <div>
                              <p className="text-sm">Transfer rejected</p>
                              <p className="text-xs text-muted-foreground">{new Date(transfer.updatedAt).toLocaleString()}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Transfer Details Modal */}
      <TransferDetailsModal
        transfer={selectedTransfer}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        userClubId={userClubId}
        onAccept={handleAccept}
        onReject={handleReject}
        onCounterOffer={handleModalCounterOffer}
        onAcceptCounter={handleAcceptCounter}
      />
    </div>
  );
}
