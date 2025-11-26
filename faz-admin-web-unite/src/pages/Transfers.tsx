import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "@/api/client";
import { Button } from "@/components/ui/button";
import StatusNoteModal from "@/pages/admin/components/StatusNoteModal";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowRightLeft, Search, Calendar, DollarSign, User } from "lucide-react";

// Query pending transfers from admin API
function usePendingTransfers() {
  return useQuery({
    queryKey: ['admin', 'transfers', 'pending'],
    queryFn: async () => {
      const { data } = await API.get('/admin/transfers/pending');
      return data.pending || [];
    },
    staleTime: 30 * 1000,
  });
}

export default function Transfers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const qc = useQueryClient();
  const { data: transfersData = [], isLoading } = usePendingTransfers();

  const approveTransfer = useMutation({
    mutationFn: ({ id }: { id: string }) => API.post(`/admin/transfers/${id}/approve`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'transfers', 'pending'] }),
  });

  const rejectTransfer = useMutation({
    mutationFn: ({ id, note }: { id: string, note?: string }) => API.post(`/admin/transfers/${id}/reject`, { note }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'transfers', 'pending'] }),
  });

  const triggerExport = useMutation({
    mutationFn: ({ id }: { id: string }) => API.post(`/admin/transfers/${id}/trigger-export`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'transfers', 'pending'] }),
  });

  const filteredTransfers = (transfersData || []).filter((transfer: any) => {
    const playerName = (transfer.player?.name || transfer.playerId?.name || transfer.playerName || '').toString();
    const fromClub = (transfer.fromClub?.name || transfer.fromClub?.clubName || transfer.fromClub || transfer.fromClubId?.club?.name || transfer.fromClubId?.name || '').toString();
    const toClub = (transfer.toClub?.name || transfer.toClub?.clubName || transfer.toClub || transfer.toClubId?.club?.name || transfer.toClubId?.name || '').toString();

    const q = searchTerm.toLowerCase();
    const matchesSearch = playerName.toLowerCase().includes(q) || fromClub.toLowerCase().includes(q) || toClub.toLowerCase().includes(q);
    const matchesStatus = filterStatus === "All" || transfer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-success text-success-foreground";
      case "Pending Approval":
        return "bg-warning text-warning-foreground";
      case "Under Review":
        return "bg-info text-info-foreground";
      case "International Clearance":
        return "bg-primary text-primary-foreground";
      case "Rejected":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Permanent":
        return "bg-primary/10 text-primary border-primary/20";
      case "Loan":
        return "bg-warning/10 text-warning border-warning/20";
      case "Free Transfer":
        return "bg-success/10 text-success border-success/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getActionButton = (transfer: any) => {
    const status = transfer.status;
    switch (status) {
      case "Pending Approval":
        return (
          <div className="flex gap-2">
            <Button variant="success" size="sm" onClick={() => approveTransfer.mutate({ id: transfer._id || transfer.id })}>Approve</Button>
            <Button variant="destructive" size="sm" onClick={() => { setRejectTransferId(transfer._id || transfer.id); setRejectModalOpen(true); }}>Reject</Button>
          </div>
        );
      case "Under Review":
        return <Button variant="default" size="sm">Review</Button>;
      case "International Clearance":
        return <Button variant="info" size="sm">Process Clearance</Button>;
      case "Approved":
        return <Button variant="outline" size="sm">View Certificate</Button>;
      case "Rejected":
        return <Button variant="ghost" size="sm">View Reason</Button>;
      default:
        return <Button variant="outline" size="sm">Details</Button>;
    }
  };

  // Reject modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectTransferId, setRejectTransferId] = useState<string | null>(null);

  const handleRejectSubmit = (note: string) => {
    if (!rejectTransferId) return;
    rejectTransfer.mutate({ id: rejectTransferId, note });
    setRejectModalOpen(false);
    setRejectTransferId(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Player Transfers</h1>
          <p className="text-muted-foreground">Manage and approve player transfer requests</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning">
            12 Pending Approval
          </Badge>
          <Button className="gap-2">
            <ArrowRightLeft className="w-4 h-4" />
            New Transfer
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search players, clubs..."
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
          <option value="Pending Approval">Pending Approval</option>
          <option value="Under Review">Under Review</option>
          <option value="Approved">Approved</option>
          <option value="International Clearance">International Clearance</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Transfers List */}
      <div className="space-y-4">
                {filteredTransfers.map((transfer) => (
          <div key={transfer.id} className="bg-card rounded-lg border border-border p-6 shadow-card">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ArrowRightLeft className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-card-foreground text-lg">{(transfer.player?.name || transfer.playerId?.name || transfer.playerName || '')}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{(transfer.fromClub?.name || transfer.fromClub?.clubName || transfer.fromClub || transfer.fromClubId?.club?.name || transfer.fromClubId?.name || '')}</span>
                      <ArrowRightLeft className="w-4 h-4" />
                      <span>{(transfer.toClub?.name || transfer.toClub?.clubName || transfer.toClub || transfer.toClubId?.club?.name || transfer.toClubId?.name || '')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(transfer.transferDate || transfer.requestDate || transfer.requestedAt || transfer.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {transfer.transferFee}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {transfer.agent}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(transfer.type)} variant="outline">
                      {transfer.type}
                    </Badge>
                  </div>
                  {/* Documents (consent/contract) */}
                  {transfer.documents && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {transfer.documents.consent?.url && (
                        <a className="mr-3 underline" target="_blank" rel="noreferrer" href={transfer.documents.consent.url}>Consent</a>
                      )}
                      {transfer.documents.contract?.url && (
                        <a className="underline" target="_blank" rel="noreferrer" href={transfer.documents.contract.url}>Contract</a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <Badge className={getStatusColor(transfer.status)}>
                  {transfer.status}
                </Badge>
                {transfer.fifaExport && transfer.fifaExport.status === 'failed' && (
                  <Button size="sm" variant="destructive" onClick={() => triggerExport.mutate({ id: transfer._id || transfer.id })}>Retry Export</Button>
                )}
                {getActionButton(transfer)}
              </div>
            </div>
          </div>
        ))}
      </div>

        <StatusNoteModal
          open={rejectModalOpen}
          title="Reject Transfer"
          label="Rejection reason"
          placeholder="Explain why the transfer is rejected — this will be sent to both clubs"
          submitLabel="Send Rejection"
          defaultValue={""}
          onCancel={() => { setRejectModalOpen(false); setRejectTransferId(null); }}
          onSubmit={handleRejectSubmit}
        />

      {filteredTransfers.length === 0 && (
        <div className="text-center py-12">
          <ArrowRightLeft className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-card-foreground mb-2">No transfers found</h3>
          <p className="text-muted-foreground">No transfers match your current search or filter criteria</p>
        </div>
      )}
    </div>
  );
}