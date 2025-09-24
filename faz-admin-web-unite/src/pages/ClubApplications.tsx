import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, FileText, User } from "lucide-react";

const applicationsData = [
  {
    id: "1",
    clubName: "Lusaka Rangers FC",
    applicant: "Michael Banda",
    submissionDate: "2024-01-15",
    status: "Under Review",
    division: "Division One",
    location: "Lusaka",
    documents: ["Certificate of Incorporation", "Constitution", "Financial Statements"],
  },
  {
    id: "2", 
    clubName: "Kabwe Warriors FC",
    applicant: "Sarah Mulenga",
    submissionDate: "2024-01-12",
    status: "Pending Documents",
    division: "Division Two",
    location: "Kabwe",
    documents: ["Certificate of Incorporation", "Constitution"],
  },
  {
    id: "3",
    clubName: "Ndola United FC",
    applicant: "James Phiri",
    submissionDate: "2024-01-10",
    status: "Approved",
    division: "Division One",
    location: "Ndola",
    documents: ["Certificate of Incorporation", "Constitution", "Financial Statements", "Ground Certificate"],
  },
  {
    id: "4",
    clubName: "Chipata FC",
    applicant: "Grace Tembo",
    submissionDate: "2024-01-08",
    status: "Rejected",
    division: "Division Two",
    location: "Chipata",
    documents: ["Certificate of Incorporation"],
  },
  {
    id: "5",
    clubName: "Mongu Town FC",
    applicant: "David Sililo",
    submissionDate: "2024-01-05",
    status: "Under Review",
    division: "Division Two",
    location: "Mongu",
    documents: ["Certificate of Incorporation", "Constitution", "Financial Statements"],
  },
];

export default function ClubApplications() {
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredApplications = applicationsData.filter(app => 
    filterStatus === "All" || app.status === filterStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-success text-success-foreground";
      case "Under Review":
        return "bg-info text-info-foreground";
      case "Pending Documents":
        return "bg-warning text-warning-foreground";
      case "Rejected":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getActionButton = (status: string) => {
    switch (status) {
      case "Under Review":
        return (
          <div className="flex gap-2">
            <Button variant="success" size="sm">Approve</Button>
            <Button variant="destructive" size="sm">Reject</Button>
          </div>
        );
      case "Pending Documents":
        return <Button variant="warning" size="sm">Request Documents</Button>;
      case "Approved":
        return <Button variant="outline" size="sm">View Certificate</Button>;
      case "Rejected":
        return <Button variant="ghost" size="sm">View Reason</Button>;
      default:
        return <Button variant="outline" size="sm">Review</Button>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Club Applications</h1>
          <p className="text-muted-foreground">Review and process new club registration applications</p>
        </div>
        <Badge variant="outline" className="bg-warning/10 text-warning border-warning">
          5 Pending Review
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <select 
          className="bg-background border border-input rounded-md px-3 py-2 text-sm"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Applications</option>
          <option value="Under Review">Under Review</option>
          <option value="Pending Documents">Pending Documents</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => (
          <div key={application.id} className="bg-card rounded-lg border border-border p-6 shadow-card">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <div>
                    <h3 className="font-semibold text-card-foreground text-lg">{application.clubName}</h3>
                    <p className="text-sm text-muted-foreground">{application.division} • {application.location}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {application.applicant}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(application.submissionDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {application.documents.length} documents
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {application.documents.map((doc, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {doc}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Badge className={getStatusColor(application.status)}>
                  {application.status}
                </Badge>
                {getActionButton(application.status)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-card-foreground mb-2">No applications found</h3>
          <p className="text-muted-foreground">No applications match your current filter criteria</p>
        </div>
      )}
    </div>
  );
}