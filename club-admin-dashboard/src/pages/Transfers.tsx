import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { getItem, removeItem } from "@/lib/storage";
import { 
  Search, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRightLeft, 
  Filter, 
  DollarSign, 
  FileText, 
  Users,
  Briefcase,
  TrendingUp,
  AlertCircle,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import TransferDetailsModal from "@/components/TransferDetailsModal";
import PlayerIDCard from "@/components/PlayerIDCard";

const API_BASE_URL = "/api";

// --- Helpers ---
const formatCurrency = (amount) => {
  if (!amount) return "K0.00";
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, "")) : amount;
  return new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW' }).format(num);
};

export default function Transfers() {
  const auth = useAuth();
  const authClub = auth?.clubData;
  
  // --- Global State ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userClubId, setUserClubId] = useState("");
  const [userClubName, setUserClubName] = useState("");
  const [activeTab, setActiveTab] = useState("market");

  // --- Data State ---
  const [transfers, setTransfers] = useState([]);
  const [players, setPlayers] = useState([]);
  const [clubs, setClubs] = useState([]);

  // --- Search/Filter State ---
  const [marketSearch, setMarketSearch] = useState("");
  const [positionFilter, setPositionFilter] = useState("All");

  // --- Modal States ---
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // --- Selection State ---
  const [selectedPlayerForTransfer, setSelectedPlayerForTransfer] = useState(null);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  // Optional: exclude a single player id from market results (set when needed)
  const [excludedPlayerId, setExcludedPlayerId] = useState(null);

  // --- Form State ---
  const [newTransfer, setNewTransfer] = useState({
    amount: "",
    type: "Permanent",
    contractLength: "1",
    salary: "",
    releaseClause: "",
    agentFee: "",
    transferWindow: "Summer",
    deadline: ""
  });
  const [requiredDocs, setRequiredDocs] = useState({ consent: false, contract: false });
  const [consentFile, setConsentFile] = useState(null);
  const [contractFile, setContractFile] = useState(null);
  
  // --- Counter Offer State ---
  const [counterOfferTransfer, setCounterOfferTransfer] = useState(null);
  const [counterOfferAmount, setCounterOfferAmount] = useState("");

  // --- Auth & Fetch Logic ---
  const fetchWithAuth = useCallback(async (url, options: any = {}) => {
    const opts = {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    };
    const response = await fetch(url, opts);
    if (response.status === 401) {
      removeItem('clubData');
      window.location.href = '/';
      return response;
    }
    return response;
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [transfersRes, playersRes, clubsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/transfers`, { credentials: 'include' }),
        // Use public players endpoint so scouting market lists all approved/active players across clubs
        fetch(`${API_BASE_URL}/public/players`),
        fetch(`/api/clubs-panel/admins`, { credentials: 'include' })
      ]);

      if (transfersRes.ok) {
        const tData = await transfersRes.json();
        setTransfers(Array.isArray(tData) ? tData : (tData.transfers || []));
      }
      if (playersRes.ok) {
        const pData = await playersRes.json();
        setPlayers(Array.isArray(pData) ? pData : (pData.players || []));
      }
      if (clubsRes.ok) {
        const cDataRaw = await clubsRes.json();
        const cData = Array.isArray(cDataRaw) ? cDataRaw : (cDataRaw.admins || cDataRaw);
        setClubs((Array.isArray(cData) ? cData : []).map((a: any) => ({
          _id: a._id,
          clubName: a.club?.name || a.name || `Club ${a._id}`,
          clubLogo: a.club?.logo?.url || a.club?.logoUrl || null,
        })));
      }
    } catch (err) {
      console.error("Fetch error:", err);
      // Don't show critical error to allow UI to render even if empty
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    if (authClub) {
      setUserClubId(String(authClub._id || authClub.id || ""));
      setUserClubName(authClub.name || "");
    } else {
      const saved = getItem('clubData');
      if (saved) {
        try {
          const c = JSON.parse(saved as string);
          setUserClubId(String(c.id || c._id || ""));
          setUserClubName(c.name || "");
        } catch (e) {
          console.error("Error parsing club data", e);
        }
      }
    }
    fetchData();
  }, [fetchData, authClub]);


  // --- Filtering Logic ---

  // 1. Market Players: Registered players NOT belonging to current user
  // Helper to consistently extract a player's club id
  const getPlayerClubId = (p: any) => {
    const pClub = p.club || p.clubId || p.currentClubId || p.registeredClub;
    if (!pClub) return null;
    return typeof pClub === 'string' ? pClub : pClub._id || pClub.id || null;
  };

  const marketPlayers = useMemo(() => {
    if (!players.length) return [];
    return players.filter(p => {
      const pClubId = getPlayerClubId(p);
      const isMyPlayer = pClubId ? String(pClubId) === String(userClubId) : false;

      // Optionally exclude a specific player from results
      if (excludedPlayerId && String(p._id) === String(excludedPlayerId)) return false;

      // Must be active/approved to be on market
      const isEligible = (p.currentStatus?.registrationStatus === 'Approved' || p.status === 'Active');

      // Search filter
      const matchesSearch = marketSearch === "" || 
        (p.name && p.name.toLowerCase().includes(marketSearch.toLowerCase())) || 
        (p.nrc && p.nrc.includes(marketSearch));

      // Position filter
      const matchesPos = positionFilter === "All" || p.position === positionFilter;

      return !isMyPlayer && isEligible && matchesSearch && matchesPos;
    });
  }, [players, userClubId, marketSearch, positionFilter, excludedPlayerId]);

  // Debug: expose marketPlayers summary to console to inspect why own-club players appear
  useEffect(() => {
    try {
      console.debug('[Transfers.debug] marketPlayers.count=', marketPlayers.length);
      console.debug('[Transfers.debug] userClubId=', userClubId);
      console.debug('[Transfers.debug] sample market players=', (marketPlayers || []).slice(0,6).map(p => ({ id: p._id, clubRaw: p.club || p.clubId || p.currentClubId, clubComputed: getPlayerClubId(p) })));
    } catch (e) { /* ignore */ }
  }, [marketPlayers, userClubId]);

  // 2. Incoming Requests (I am Seller)
  const incomingRequests = useMemo(() => {
    return transfers.filter(t => t.fromClub?._id === userClubId);
  }, [transfers, userClubId]);

  // 3. Outgoing Bids (I am Buyer)
  const outgoingBids = useMemo(() => {
    return transfers.filter(t => t.toClub?._id === userClubId);
  }, [transfers, userClubId]);

  // --- Handlers ---

  const initiateTransfer = (player) => {
    console.debug('[Transfers.debug] initiateTransfer clicked for player:', player?._id || player?.id || player?.name);
    setSelectedPlayerForTransfer(player);
    // Reset form
    setNewTransfer({
      amount: "",
      type: "Permanent",
      contractLength: "2",
      salary: "",
      releaseClause: "",
      agentFee: "",
      transferWindow: "Summer",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Default 1 week
    });
    setRequiredDocs({ consent: false, contract: false });
    setIsOfferModalOpen(true);
  };

  const submitOffer = async () => {
    if (!selectedPlayerForTransfer) return;

    // Close modal immediately for a snappy UX, show loading while request completes
    setIsOfferModalOpen(false);
    setLoading(true);

    // Determine selling club ID
    const p = selectedPlayerForTransfer;
    const sellerClubIdRaw = getPlayerClubId(p) || p.club || p.clubId || p.currentClubId || null;
    const sellerClubId = sellerClubIdRaw ? String(sellerClubIdRaw._id || sellerClubIdRaw.id || sellerClubIdRaw) : null;

    if (!sellerClubId) {
      setError("Cannot determine selling club for this player.");
      // re-open modal so user can fix selection
      setIsOfferModalOpen(true);
      setLoading(false);
      return;
    }

    try {
      const payload = {
        fromClubId: sellerClubId,
        toClubId: String(userClubId),
        playerId: p._id || p.id,
        ...newTransfer
      };

      const res = await fetchWithAuth(`${API_BASE_URL}/transfers`, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(await res.text());

      const result = await res.json();
      const createdId = result.transfer?._id || result._id;

      // Upload docs
      if (consentFile || contractFile) {
        const fd = new FormData();
        if (consentFile) fd.append('consent', consentFile);
        if (contractFile) fd.append('contract', contractFile);
        await fetch(`${API_BASE_URL}/transfers/${createdId}/documents`, {
          method: 'POST',
          credentials: 'include',
          body: fd,
        });
      }

      fetchData();
      setActiveTab("outgoing"); // Switch to view the new bid
    } catch (err: any) {
      setError(err.message || 'Failed to submit transfer');
      // reopen modal so user can retry or see fields
      setIsOfferModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, transferId, payload = {}) => {
    try {
      let endpoint = "";
      let method = "PUT";

      if (action === "accept") endpoint = `${API_BASE_URL}/transfers/${transferId}/accept`;
      if (action === "reject") endpoint = `${API_BASE_URL}/transfers/${transferId}/reject`;
      if (action === "counter") {
        endpoint = `${API_BASE_URL}/transfers/${transferId}/counter-offer`;
        method = "POST";
      }

      const res = await fetchWithAuth(endpoint, {
        method,
        body: Object.keys(payload).length ? JSON.stringify(payload) : undefined
      });

      if (!res.ok) throw new Error(await res.text());
      
      if (action === "counter") setCounterOfferTransfer(null);
      fetchData();
      // Also close details modal if open
      if (isDetailsModalOpen) setIsDetailsModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // --- Render Helpers ---

  const getStatusBadge = (status) => {
    const styles = {
      'Approved': 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100',
      'Rejected': 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100',
      'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
      'CounterOffered': 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100',
      'Cancelled': 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100'
    };
    return (
      <Badge variant="outline" className={`${styles[status] || 'bg-gray-100'} px-3 py-1 font-medium`}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 min-h-screen font-sans">
      {/* Header */}
      <header className="bg-white border-b px-8 py-6 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Transfer Hub</h1>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <Briefcase size={14} /> 
              {userClubName} Management Console
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              className={activeTab === 'market' ? 'bg-primary text-primary-foreground' : 'bg-transparent text-foreground hover:bg-slate-100'}
              variant={activeTab === 'market' ? 'default' : 'ghost'} 
              onClick={() => setActiveTab('market')}
            >
              <Users size={16} className="mr-2" /> Scouting Market
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
            <XCircle size={20} />
            {error}
            <Button variant="ghost" size="sm" className="ml-auto h-8 hover:bg-red-100" onClick={() => setError("")}>Dismiss</Button>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border shadow-sm p-1 h-auto w-full justify-start overflow-x-auto">
            <TabsTrigger value="market" className="px-6 py-2.5 data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all">
              <Users size={16} className="mr-2" /> Transfer Market
            </TabsTrigger>
            <TabsTrigger value="incoming" className="px-6 py-2.5 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 relative transition-all">
              <ArrowRightLeft size={16} className="mr-2" /> 
              Incoming Requests (Selling)
              {incomingRequests.filter(t => t.status === 'Pending').length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center h-5 w-5 bg-red-500 text-white text-[10px] font-bold rounded-full shadow-sm">
                  {incomingRequests.filter(t => t.status === 'Pending').length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="outgoing" className="px-6 py-2.5 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 transition-all">
              <TrendingUp size={16} className="mr-2" /> 
              My Active Bids (Buying)
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: TRANSFER MARKET (SCOUTING) */}
          <TabsContent value="market" className="space-y-6 animate-in fade-in-50">
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-4">
                <CardTitle>Player Scouting</CardTitle>
                <CardDescription>Search and bid for players registered to other clubs.</CardDescription>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input 
                      placeholder="Search player name, ID or NRC..." 
                      className="pl-10" 
                      value={marketSearch}
                      onChange={e => setMarketSearch(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter size={16} className="text-slate-500" />
                    <select 
                      className="h-10 px-3 py-2 bg-background border border-input rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={positionFilter}
                      onChange={e => setPositionFilter(e.target.value)}
                    >
                      <option value="All">All Positions</option>
                      <option value="Forward">Forward</option>
                      <option value="Midfielder">Midfielder</option>
                      <option value="Defender">Defender</option>
                      <option value="Goalkeeper">Goalkeeper</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
              {marketPlayers.length > 0 ? (
                marketPlayers.map(player => (
                  <PlayerIDCard 
                    key={player._id} 
                    player={player} 
                    onAction={initiateTransfer} 
                  />
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-slate-500">
                  <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Search size={24} className="text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900">No players found</h3>
                  <p>Try adjusting your filters or search terms.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* TAB 2: INCOMING REQUESTS (SELLING) */}
          <TabsContent value="incoming" className="space-y-6 animate-in fade-in-50">
             <Card>
              <CardHeader>
                <CardTitle>Incoming Offers</CardTitle>
                <CardDescription>Review and respond to transfer bids for your players.</CardDescription>
              </CardHeader>
              <CardContent>
                {incomingRequests.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50">
                    <ArrowRightLeft className="mx-auto mb-3 text-slate-300" size={48} />
                    <p>No active incoming offers at the moment.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {incomingRequests.map(transfer => (
                      <div key={transfer._id} className="flex flex-col md:flex-row items-center justify-between p-5 border rounded-xl hover:border-slate-300 transition-colors bg-white shadow-sm">
                        <div className="flex items-center gap-6 w-full md:w-auto mb-4 md:mb-0">
                          <div className="h-14 w-14 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xl shrink-0">
                            {transfer.player?.name?.charAt(0) || "?"}
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">{transfer.player?.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                              <Badge variant="secondary" className="font-normal">
                                From: {transfer.toClub?.clubName || "Unknown Buyer"}
                              </Badge>
                              <span>•</span>
                              <span>{new Date(transfer.requestDate).toLocaleDateString()}</span>
                            </div>
                            <div className="mt-2 text-lg font-mono font-semibold text-slate-900 flex items-center gap-2">
                              {formatCurrency(transfer.amount)}
                              <span className="text-xs font-sans font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                {transfer.type}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                           {getStatusBadge(transfer.status)}
                           
                           {transfer.status === 'Pending' && (
                             <div className="flex gap-2 w-full md:w-auto">
                               <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300" onClick={() => handleAction('reject', transfer._id)}>
                                 Reject
                               </Button>
                               <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300" onClick={() => setCounterOfferTransfer(transfer)}>
                                 Counter
                               </Button>
                               <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleAction('accept', transfer._id)}>
                                 Accept Offer
                               </Button>
                             </div>
                           )}
                           
                           {transfer.status === 'CounterOffered' && transfer.counterOffers?.[transfer.counterOffers.length - 1]?.fromClub !== userClubId && (
                             <div className="flex gap-2">
                               <span className="text-sm text-blue-600 italic flex items-center mr-2">
                                 <AlertCircle size={14} className="mr-1"/> They countered
                               </span>
                               <Button size="sm" onClick={() => {
                                  // Accept logic for the latest counter offer
                                  handleAction('accept', transfer._id); 
                               }}>
                                 Accept Their {formatCurrency(transfer.counterOffers[transfer.counterOffers.length - 1].amount)}
                               </Button>
                             </div>
                           )}

                           <Button variant="link" size="sm" className="text-slate-400 h-auto p-0" onClick={() => {
                             setSelectedTransfer(transfer);
                             setIsDetailsModalOpen(true);
                           }}>
                             View Full Details
                           </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
             </Card>
          </TabsContent>

          {/* TAB 3: OUTGOING BIDS (BUYING) */}
          <TabsContent value="outgoing" className="space-y-6 animate-in fade-in-50">
            <Card>
              <CardHeader>
                <CardTitle>My Active Bids</CardTitle>
                <CardDescription>Track the status of players you are trying to sign.</CardDescription>
              </CardHeader>
              <CardContent>
                 {outgoingBids.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50">
                    <TrendingUp className="mx-auto mb-3 text-slate-300" size={48} />
                    You haven't made any transfer offers yet. Go to the Market to scout players.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {outgoingBids.map(transfer => (
                      <div key={transfer._id} className="flex flex-col md:flex-row items-center justify-between p-5 border rounded-xl hover:bg-slate-50 transition-colors">
                         <div className="flex items-center gap-6">
                           <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                             <TrendingUp size={20} />
                           </div>
                           <div>
                             <h4 className="font-bold">{transfer.player?.name}</h4>
                             <p className="text-sm text-slate-500">
                               Offer to: <span className="text-slate-700 font-medium">{transfer.fromClub?.clubName}</span>
                             </p>
                             <div className="mt-1 flex items-center gap-2 text-sm">
                               <span className="font-mono">{formatCurrency(transfer.amount)}</span>
                               <span className="text-xs text-slate-400">•</span>
                               <span className="text-xs text-slate-500">{transfer.type}</span>
                             </div>
                           </div>
                         </div>
                         <div className="flex items-center gap-4 mt-4 md:mt-0">
                            {getStatusBadge(transfer.status)}
                            <Button variant="ghost" size="sm" onClick={() => {
                              setSelectedTransfer(transfer);
                              setIsDetailsModalOpen(true);
                            }}>Details</Button>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* --- CREATE OFFER MODAL --- */}
      <Dialog open={isOfferModalOpen} onOpenChange={setIsOfferModalOpen}>
        <DialogContent className="sm:max-w-[700px] bg-slate-50 max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="bg-white p-6 border-b rounded-t-lg flex-shrink-0">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileText className="text-primary" />
              Official Transfer Proposal
            </DialogTitle>
            <DialogDescription>
              Submit a formal bid for <strong>{selectedPlayerForTransfer?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {/* Financials Section */}
              <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <DollarSign size={14} /> Financial Terms
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                     <Label>Transfer Fee (ZMW)</Label>
                     <Input 
                       placeholder="0.00" 
                       className="font-mono text-lg"
                       value={newTransfer.amount}
                       onChange={e => setNewTransfer({...newTransfer, amount: e.target.value})}
                     />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                     <Label>Transfer Type</Label>
                     <select 
                       className="w-full h-10 px-3 border rounded-md bg-background"
                       value={newTransfer.type}
                       onChange={e => setNewTransfer({...newTransfer, type: e.target.value})}
                     >
                       <option value="Permanent">Permanent Transfer</option>
                       <option value="Loan">Loan</option>
                     </select>
                  </div>
                  <div>
                    <Label>Proposed Salary (Yearly)</Label>
                    <Input 
                      placeholder="0.00" 
                      value={newTransfer.salary}
                      onChange={e => setNewTransfer({...newTransfer, salary: e.target.value})}
                    />
                  </div>
                   <div>
                    <Label>Contract Length (Years)</Label>
                    <Input 
                      type="number" 
                      min="1" max="5"
                      value={newTransfer.contractLength}
                      onChange={e => setNewTransfer({...newTransfer, contractLength: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Clauses Section */}
              <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
                 <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FileText size={14} /> Clauses & Fees
                </h4>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <Label>Agent Fee (ZMW)</Label>
                    <Input 
                      placeholder="0.00" 
                      value={newTransfer.agentFee}
                      onChange={e => setNewTransfer({...newTransfer, agentFee: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Release Clause (Optional)</Label>
                    <Input 
                      placeholder="0.00" 
                      value={newTransfer.releaseClause}
                      onChange={e => setNewTransfer({...newTransfer, releaseClause: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                <h4 className="text-sm font-semibold text-blue-900 mb-3">Required Documentation</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <input 
                      type="checkbox" 
                      id="doc_consent" 
                      className="mt-1"
                      checked={requiredDocs.consent}
                      onChange={e => setRequiredDocs({...requiredDocs, consent: e.target.checked})}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="doc_consent" className="cursor-pointer font-medium text-slate-700">Player Consent Form</Label>
                      <p className="text-xs text-slate-500">I confirm the player has agreed to negotiations.</p>
                      <Input type="file" className="h-8 text-xs" onChange={e => setConsentFile(e.target.files?.[0])} />
                    </div>
                  </div>
                  
                  <Separator className="bg-blue-200/50" />

                  <div className="flex items-start gap-3">
                    <input 
                      type="checkbox" 
                      id="doc_contract" 
                      className="mt-1"
                      checked={requiredDocs.contract}
                      onChange={e => setRequiredDocs({...requiredDocs, contract: e.target.checked})}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="doc_contract" className="cursor-pointer font-medium text-slate-700">Draft Contract</Label>
                      <p className="text-xs text-slate-500">Upload the proposed contract terms.</p>
                      <Input type="file" className="h-8 text-xs" onChange={e => setContractFile(e.target.files?.[0])} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter className="p-6 bg-white border-t rounded-b-lg flex-shrink-0">
             <Button variant="outline" onClick={() => setIsOfferModalOpen(false)}>Cancel</Button>
             <Button 
               onClick={submitOffer} 
               disabled={!requiredDocs.consent || !requiredDocs.contract || !newTransfer.amount}
               className="bg-primary hover:bg-primary/90"
             >
               Submit Official Offer
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- COUNTER OFFER MODAL --- */}
      <Dialog open={!!counterOfferTransfer} onOpenChange={(open) => !open && setCounterOfferTransfer(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Negotiate Transfer Fee</DialogTitle>
            <DialogDescription>
              Propose a new fee for {counterOfferTransfer?.player?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-3 bg-slate-100 rounded text-center">
              <span className="text-xs text-slate-500 uppercase">Current Offer</span>
              <div className="text-xl font-bold line-through text-slate-400">
                {counterOfferTransfer && formatCurrency(counterOfferTransfer.amount)}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Your Counter Offer (ZMW)</Label>
              <Input 
                autoFocus
                placeholder="Enter amount..." 
                value={counterOfferAmount}
                onChange={e => setCounterOfferAmount(e.target.value)}
                className="text-lg"
              />
            </div>
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setCounterOfferTransfer(null)}>Cancel</Button>
             <Button onClick={() => handleAction('counter', counterOfferTransfer._id, { fee: parseFloat(counterOfferAmount) })}>
               Send Counter Offer
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- DETAILS MODAL WRAPPER --- */}
      {selectedTransfer && (
        <TransferDetailsModal
          transfer={selectedTransfer}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          userClubId={userClubId}
          onAccept={(id) => handleAction('accept', id)}
          onReject={(id) => handleAction('reject', id)}
          onCounterOffer={(t, amt) => handleAction('counter', t._id, { fee: parseFloat(amt) })}
          onAcceptCounter={(tId, offerId) => handleAction('accept', tId)}
        />
      )}
    </div>
  );
}