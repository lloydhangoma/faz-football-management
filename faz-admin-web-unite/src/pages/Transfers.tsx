import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowRightLeft, Search, Calendar, DollarSign, User } from "lucide-react";

const transfersData = [
  {
    id: "1",
    playerName: "Emmanuel Banda",
    fromClub: "Nkana FC",
    toClub: "Power Dynamos FC",
    transferDate: "2024-01-15",
    transferFee: "$25,000",
    status: "Pending Approval",
    type: "Permanent",
    agent: "Sports Management Ltd",
  },
  {
    id: "2",
    playerName: "Collins Sikombe",
    fromClub: "Zanaco FC",
    toClub: "Nkana FC",
    transferDate: "2024-01-14",
    transferFee: "$15,000",
    status: "Approved",
    type: "Permanent",
    agent: "No Agent",
  },
  {
    id: "3",
    playerName: "Fashion Sakala",
    fromClub: "Power Dynamos FC",
    toClub: "Al Ittihad (Saudi Arabia)",
    transferDate: "2024-01-12",
    transferFee: "$180,000",
    status: "International Clearance",
    type: "Permanent",
    agent: "FIFA Agent Services",
  },
  {
    id: "4",
    playerName: "Moses Phiri",
    fromClub: "Lusaka Dynamos FC",
    toClub: "Green Eagles FC",
    transferDate: "2024-01-10",
    transferFee: "Free Transfer",
    status: "Rejected",
    type: "Free Transfer",
    agent: "No Agent",
  },
  {
    id: "5",
    playerName: "Kennedy Musonda",
    fromClub: "Kabwe Warriors FC",
    toClub: "Zanaco FC",
    transferDate: "2024-01-08",
    transferFee: "$8,000",
    status: "Under Review",
    type: "Loan",
    agent: "Player Agent ZM",
  },
];

export default function Transfers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredTransfers = transfersData.filter(transfer => {
    const matchesSearch = transfer.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.fromClub.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.toClub.toLowerCase().includes(searchTerm.toLowerCase());
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

  const getActionButton = (status: string) => {
    switch (status) {
      case "Pending Approval":
        return (
          <div className="flex gap-2">
            <Button variant="success" size="sm">Approve</Button>
            <Button variant="destructive" size="sm">Reject</Button>
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
                    <h3 className="font-semibold text-card-foreground text-lg">{transfer.playerName}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{transfer.fromClub}</span>
                      <ArrowRightLeft className="w-4 h-4" />
                      <span>{transfer.toClub}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(transfer.transferDate).toLocaleDateString()}
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
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Badge className={getStatusColor(transfer.status)}>
                  {transfer.status}
                </Badge>
                {getActionButton(transfer.status)}
              </div>
            </div>
          </div>
        ))}
      </div>

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