import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRightLeft, 
  User, 
  Building, 
  DollarSign,
  Calendar,
  FileText,
  TrendingUp
} from "lucide-react";

interface Transfer {
  _id: string;
  player: {
    _id: string;
    name: string;
    nrc: string;
    position: string;
    age?: number;
  };
  fromClub: {
    _id: string;
    clubName: string;
  };
  toClub: {
    _id: string;
    clubName: string;
  };
  amount: string;
  type: string;
  contractLength?: number;
  salary?: number;
  releaseClause?: number;
  agentFee?: number;
  transferWindow?: string;
  deadline?: string;
  status: string;
  requestDate: string;
  approvalDate?: string;
  counterOffers: Array<{
    amount: number;
    proposedBy: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface TransferDetailsModalProps {
  transfer: Transfer | null;
  isOpen: boolean;
  onClose: () => void;
  userClubId: string;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onCounterOffer: (transfer: Transfer, amount: string) => void;
  onAcceptCounter: (id: string) => void;
}

export default function TransferDetailsModal({
  transfer,
  isOpen,
  onClose,
  userClubId,
  onAccept,
  onReject,
  onCounterOffer,
  onAcceptCounter
}: TransferDetailsModalProps) {
  const [counterOfferAmount, setCounterOfferAmount] = useState("");
  const [showCounterOfferInput, setShowCounterOfferInput] = useState(false);

  if (!transfer) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CounterOffered': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle size={16} />;
      case 'Rejected': return <XCircle size={16} />;
      case 'Pending': return <Clock size={16} />;
      case 'CounterOffered': return <TrendingUp size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const formatCurrency = (amount: string | number) => {
    if (!amount) return 'N/A';
    return typeof amount === 'string' ? amount : `K${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isIncomingTransfer = userClubId === transfer.toClub._id;
  const isOutgoingTransfer = userClubId === transfer.fromClub._id;
  const canTakeAction = transfer.status === 'Pending' && isIncomingTransfer;
  const canAcceptCounter = transfer.status === 'CounterOffered' && isOutgoingTransfer;

  const handleCounterOfferSubmit = () => {
    if (counterOfferAmount.trim()) {
      onCounterOffer(transfer, counterOfferAmount);
      setCounterOfferAmount("");
      setShowCounterOfferInput(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ArrowRightLeft className="text-primary" />
            Transfer Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transfer Status Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <ArrowRightLeft size={24} className="text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{transfer.player.name}</h2>
                    <p className="text-muted-foreground">
                      {transfer.fromClub.clubName} → {transfer.toClub.clubName}
                    </p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(transfer.status)} px-3 py-1`}>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(transfer.status)}
                    {transfer.status}
                  </div>
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Player Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User size={20} />
                  Player Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{transfer.player.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">NRC:</span>
                  <span className="font-medium">{transfer.player.nrc}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Position:</span>
                  <span className="font-medium">{transfer.player.position || 'N/A'}</span>
                </div>
                {transfer.player.age && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Age:</span>
                    <span className="font-medium">{transfer.player.age} years</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Club Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building size={20} />
                  Club Transfer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">From:</span>
                  <span className="font-medium">{transfer.fromClub.clubName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">To:</span>
                  <span className="font-medium">{transfer.toClub.clubName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transfer Type:</span>
                  <span className="font-medium">{transfer.type}</span>
                </div>
                {transfer.transferWindow && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Window:</span>
                    <span className="font-medium">{transfer.transferWindow}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Financial Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign size={20} />
                  Financial Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transfer Amount:</span>
                  <span className="font-medium text-lg">{formatCurrency(transfer.amount)}</span>
                </div>
                {transfer.salary && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Salary:</span>
                    <span className="font-medium">{formatCurrency(transfer.salary)}</span>
                  </div>
                )}
                {transfer.releaseClause && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Release Clause:</span>
                    <span className="font-medium">{formatCurrency(transfer.releaseClause)}</span>
                  </div>
                )}
                {transfer.agentFee && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Agent Fee:</span>
                    <span className="font-medium">{formatCurrency(transfer.agentFee)}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contract & Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar size={20} />
                  Timeline & Contract
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Request Date:</span>
                  <span className="font-medium">{formatDate(transfer.requestDate)}</span>
                </div>
                {transfer.deadline && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deadline:</span>
                    <span className="font-medium">{new Date(transfer.deadline).toLocaleDateString()}</span>
                  </div>
                )}
                {transfer.contractLength && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contract Length:</span>
                    <span className="font-medium">{transfer.contractLength} years</span>
                  </div>
                )}
                {transfer.approvalDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Approved Date:</span>
                    <span className="font-medium">{formatDate(transfer.approvalDate)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Counter Offers Section */}
          {transfer.counterOffers && transfer.counterOffers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={20} />
                  Counter Offers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transfer.counterOffers.map((offer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{formatCurrency(offer.amount)}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(offer.timestamp)}
                        </p>
                      </div>
                      <Badge variant="outline">Counter Offer #{index + 1}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Transfer Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} />
                Transfer Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Transfer Request Submitted</p>
                    <p className="text-sm text-muted-foreground">
                      Amount: {formatCurrency(transfer.amount)} • {formatDate(transfer.requestDate)}
                    </p>
                  </div>
                </div>

                {transfer.counterOffers.map((offer, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Counter Offer #{index + 1}</p>
                      <p className="text-sm text-muted-foreground">
                        Amount: {formatCurrency(offer.amount)} • {formatDate(offer.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}

                {transfer.status === 'Approved' && (
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Transfer Approved</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transfer.approvalDate || transfer.updatedAt)}
                      </p>
                    </div>
                  </div>
                )}

                {transfer.status === 'Rejected' && (
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Transfer Rejected</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transfer.updatedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3">
                {canTakeAction && (
                  <>
                    <Button 
                      onClick={() => onAccept(transfer._id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Accept Transfer
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => onReject(transfer._id)}
                    >
                      <XCircle size={16} className="mr-2" />
                      Reject Transfer
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setShowCounterOfferInput(!showCounterOfferInput)}
                    >
                      <TrendingUp size={16} className="mr-2" />
                      Counter Offer
                    </Button>
                  </>
                )}

                {canAcceptCounter && (
                  <Button 
                    onClick={() => onAcceptCounter(transfer._id)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Accept Counter Offer
                  </Button>
                )}

                {!canTakeAction && !canAcceptCounter && (
                  <div className="text-muted-foreground">
                    {isIncomingTransfer ? 'Incoming transfer' : 'Outgoing transfer'} • 
                    No actions available for current status
                  </div>
                )}
              </div>

              {/* Counter Offer Input */}
              {showCounterOfferInput && (
                <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                  <Label htmlFor="counterAmount" className="text-sm font-medium">
                    Counter Offer Amount
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="counterAmount"
                      placeholder="Enter amount (e.g., 50000)"
                      value={counterOfferAmount}
                      onChange={(e) => setCounterOfferAmount(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleCounterOfferSubmit}>
                      Submit
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowCounterOfferInput(false);
                        setCounterOfferAmount("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}