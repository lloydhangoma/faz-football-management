import { useEffect, useState } from "react";
import { Search, Plus, Eye, Edit, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE_URL = "/api";

export default function Players() {
  // Router hooks
  const navigate = useNavigate();
  const { playerId } = useParams();

  // Core UI state (always declared in the same order)
  const [searchTerm, setSearchTerm] = useState("");
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Edit player state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editPlayer, setEditPlayer] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // Add player state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState<any>({});
  const [addFile, setAddFile] = useState<File | null>(null);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  // Delete player state (always declared)
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  // Handle file input change for avatar
  const handleAddFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAddFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/players`);
        const data = await res.json();
        setPlayers(data);
      } catch (err) {
        setError("Failed to fetch players.");
      }
      setLoading(false);
    };
    fetchPlayers();
  }, []);

  // Derived values (pure, not hooks)
  const selectedPlayer = playerId ? players.find((p) => p._id === playerId) : null;

  // Get user role and club from localStorage (safe, synchronous)
  let userRole = "club-admin";
  let userClub = "";
  try {
    const clubDataRaw = localStorage.getItem("clubData");
    if (clubDataRaw) {
      const clubData = JSON.parse(clubDataRaw);
      userClub = clubData?.name || "";
    }
    userRole = localStorage.getItem("userRole") || "club-admin";
  } catch (e) {
    /* ignore parse errors */
  }

  const filteredPlayers = players.filter((player) => {
    const q = searchTerm.toLowerCase();
    return (
      player.name?.toLowerCase().includes(q) ||
      String(player.nrc || "").includes(searchTerm) ||
      player.position?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return <div className="p-8">Loading players...</div>;
  }
  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  // Open modal and set form data
  const handleEditClick = (player: any) => {
    setEditPlayer(player);
    setEditForm({ ...player });
    setEditModalOpen(true);
    setEditError("");
  };

  // Handle form changes
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Submit update
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    try {
      const res = await fetch(`${API_BASE_URL}/players/${editPlayer._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Failed to update player.");
      // Refresh player list/profile
      setEditModalOpen(false);
      setEditPlayer(null);
      setEditForm({});
      // Optionally, refetch players
      const updatedRes = await fetch(`${API_BASE_URL}/players`);
      setPlayers(await updatedRes.json());
    } catch (err: any) {
      setEditError(err.message || "Update failed.");
    }
    setEditLoading(false);
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("jwt");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Handle add form changes
  const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  // Submit new player
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError("");
    try {
      const formData = new FormData();
      Object.entries(addForm).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      if (addFile) {
        formData.append("avatar", addFile);
      }
      const res = await fetch(`${API_BASE_URL}/players`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(), // Do NOT set Content-Type, browser will set it for FormData
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to add player.");
      setAddModalOpen(false);
      setAddForm({});
      setAddFile(null);
      // Optionally, refetch players
      const updatedRes = await fetch(`${API_BASE_URL}/players`);
      setPlayers(await updatedRes.json());
    } catch (err: any) {
      setAddError(err.message || "Add failed.");
    }
    setAddLoading(false);
  };

  // Permission helper
  const canDelete = Boolean(
    selectedPlayer &&
      (userRole === "super-admin" || (userRole === "club-admin" && selectedPlayer.status !== "Active" && selectedPlayer.club === userClub))
  );

  const handleDelete = async () => {
    if (!selectedPlayer) return;
    if (!window.confirm("Are you sure you want to deregister this player?")) return;
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const res = await fetch(`${API_BASE_URL}/players/${selectedPlayer._id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete player.");
      setPlayers((prev) => prev.filter((p) => p._id !== selectedPlayer._id));
      navigate("/dashboard/players");
    } catch (err: any) {
      setDeleteError(err.message || "Delete failed.");
    }
    setDeleteLoading(false);
  };

  if (selectedPlayer) {
    return (
      <div className="flex-1">
        {/* Header */}
        <header className="bg-card border-b px-8 py-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard/players')} // Updated path
              className="text-primary hover:text-primary/80"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Players
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Player Profile</h1>
              <p className="text-muted-foreground mt-1">{selectedPlayer.name} - Detailed Information</p>
            </div>
          </div>
        </header>

        {/* Player Profile Content */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-8">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg overflow-hidden">
                    {selectedPlayer.avatar ? (
                      <img
                        src={selectedPlayer.avatar.startsWith('/') ? selectedPlayer.avatar : `/lovable-uploads/${selectedPlayer.avatar}`}
                        alt={selectedPlayer.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-primary-foreground">
                        {selectedPlayer.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-foreground mb-2">{selectedPlayer.name}</h1>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Position:</span>
                        <span className="ml-2 font-medium">{selectedPlayer.position}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Age:</span>
                        <span className="ml-2 font-medium">{selectedPlayer.age}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Club:</span>
                        <span className="ml-2 font-medium">{selectedPlayer.club}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <Badge 
                          variant={selectedPlayer.status === 'Active' ? 'default' : 'destructive'}
                          className={selectedPlayer.status === 'Active' ? 'bg-success text-success-foreground ml-2' : 'ml-2'}
                        >
                          {selectedPlayer.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">National Registration Card</label>
                    <p className="text-foreground font-medium">{selectedPlayer.nrc}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nationality</label>
                    <p className="text-foreground font-medium">{selectedPlayer.nationality}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-foreground font-medium">{selectedPlayer.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-foreground font-medium">{selectedPlayer.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date Joined</label>
                    <p className="text-foreground font-medium">{new Date(selectedPlayer.joined).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Career History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-2 border-primary pl-4">
                      <h4 className="font-semibold text-foreground">{selectedPlayer.club}</h4>
                      <p className="text-sm text-muted-foreground">Current Club • {new Date(selectedPlayer.joined).toLocaleDateString()} - Present</p>
                      <p className="text-sm text-muted-foreground">Position: {selectedPlayer.position}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Button className="bg-primary hover:bg-primary/90" onClick={() => handleEditClick(selectedPlayer)}>
                    <Edit size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline">
                    Disciplinary Records
                  </Button>
                  <Button variant="outline">
                    Transfer History
                  </Button>
                  {canDelete && (
                    <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
                      {deleteLoading ? 'Deleting...' : 'Deregister Player'}
                    </Button>
                  )}
                </div>
                {deleteError && <div className="text-red-500 text-sm mt-2">{deleteError}</div>}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* Header */}
      <header className="bg-card border-b px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Player Management</h1>
            <p className="text-muted-foreground mt-1">Manage all registered players in the FAZ system</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => setAddModalOpen(true)}>
            <Plus size={16} className="mr-2" />
            Register New Player
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Players</CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Search players..." 
                    className="pl-10 w-80"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPlayers.map((player) => (
                <div 
                  key={player._id} 
                  className="flex items-center justify-between p-6 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/dashboard/players/${player._id}`)} // Updated path
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md overflow-hidden">
                      {player.avatar ? (
                        <img
                          src={player.avatar.startsWith('/') ? player.avatar : `/lovable-uploads/${player.avatar}`}
                          alt={player.name}
                          className="w-full h-full object-cover rounded-full"
                          onError={e => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <span className="text-lg font-bold text-primary-foreground">
                          {player.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg hover:text-primary transition-colors">
                        {player.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>NRC: {player.nrc}</span>
                        <span>•</span>
                        <span>{player.position}</span>
                        <span>•</span>
                        <span>Age: {player.age}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge 
                      variant={player.status === 'Active' ? 'default' : 'destructive'}
                      className={player.status === 'Active' ? 'bg-success text-success-foreground' : ''}
                    >
                      {player.status}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary hover:text-primary/80"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dashboard/players/${player._id}`); // Updated path
                      }}
                    >
                      <Eye size={14} className="mr-1" />
                      View Profile
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Edit Player Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Player</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <Input name="name" value={editForm.name || ""} onChange={handleEditFormChange} placeholder="Name" />
              <Input name="age" value={editForm.age || ""} onChange={handleEditFormChange} placeholder="Age" type="number" />
              <Input name="nrc" value={editForm.nrc || ""} onChange={handleEditFormChange} placeholder="NRC" />
              <Input name="position" value={editForm.position || ""} onChange={handleEditFormChange} placeholder="Position" />
              <Input name="club" value={editForm.club || ""} onChange={handleEditFormChange} placeholder="Club" />
              <Input name="nationality" value={editForm.nationality || ""} onChange={handleEditFormChange} placeholder="Nationality" />
              <Input name="phone" value={editForm.phone || ""} onChange={handleEditFormChange} placeholder="Phone" />
              <Input name="email" value={editForm.email || ""} onChange={handleEditFormChange} placeholder="Email" />
              <div className="flex gap-2">
                <Button type="submit" disabled={editLoading} className="bg-primary text-white">{editLoading ? "Saving..." : "Save"}</Button>
                <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button>
              </div>
              {editError && <div className="text-red-500 text-sm">{editError}</div>}
            </form>
          </div>
        </div>
      )}

      {/* Add Player Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Register New Player</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4" encType="multipart/form-data">
              {/* Required fields for Player model */}
              <Input name="name" value={addForm.name || ""} onChange={handleAddFormChange} placeholder="Name" required />
              <Input name="age" value={addForm.age || ""} onChange={handleAddFormChange} placeholder="Age" type="number" required />
              <Input name="nrc" value={addForm.nrc || ""} onChange={handleAddFormChange} placeholder="NRC" required />
              <Input name="position" value={addForm.position || ""} onChange={handleAddFormChange} placeholder="Position" required />
              <Input name="joined" value={addForm.joined || ""} onChange={handleAddFormChange} placeholder="Date Joined" type="date" required />
              {/* Optional fields */}
              <Input name="nationality" value={addForm.nationality || ""} onChange={handleAddFormChange} placeholder="Nationality" />
              <Input name="phone" value={addForm.phone || ""} onChange={handleAddFormChange} placeholder="Phone" />
              <Input name="email" value={addForm.email || ""} onChange={handleAddFormChange} placeholder="Email" />
              <Input type="file" name="avatar" accept="image/*" onChange={handleAddFileChange} />
              <div className="flex gap-2">
                <Button type="submit" disabled={addLoading} className="bg-primary text-white">{addLoading ? "Saving..." : "Save"}</Button>
                <Button type="button" variant="outline" onClick={() => setAddModalOpen(false)}>Cancel</Button>
              </div>
              {addError && <div className="text-red-500 text-sm">{addError}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
