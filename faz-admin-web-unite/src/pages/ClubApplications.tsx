import { useEffect, useMemo, useState } from "react";
import { API } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Calendar,
  FileText,
  User,
  Search,
  Eye,
  Trash2,
} from "lucide-react";

import ViewClubResgistrationModal from "@/pages/admin/components/ViewClubResgistrationModal";
import DeleteModal from "@/pages/admin/components/DeleteModal";
import StatusNoteModal from "@/pages/admin/components/StatusNoteModal";

type Item = {
  _id: string;
  clubName: string;
  applicant: string;
  createdAt: string;
  status: "under-review" | "pending-docs" | "approved" | "rejected";
  location: string;
  documents: {
    constitution: boolean;
    clubLicense: boolean;
    contactId: boolean;
    supporting: number;
  };
};

type ListResp = { page: number; limit: number; total: number; items: Item[] };
type Counts = { total: number; underReview: number; pendingDocs: number; approved: number; rejected: number };

const STATUS_LABEL: Record<Item["status"], string> = {
  "under-review": "Under Review",
  "pending-docs": "Pending Documents",
  approved: "Approved",
  rejected: "Rejected",
};

const statusClass = (s: Item["status"]) => {
  switch (s) {
    case "approved": return "bg-success text-success-foreground";
    case "under-review": return "bg-info text-info-foreground";
    case "pending-docs": return "bg-warning text-warning-foreground";
    case "rejected": return "bg-destructive text-destructive-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

export default function ClubApplications() {
  const [status, setStatus] = useState<"all" | Item["status"]>("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [data, setData] = useState<ListResp>({ page: 1, limit, total: 0, items: [] });
  const [counts, setCounts] = useState<Counts | null>(null);
  const [loading, setLoading] = useState(false);

  // view/delete modals
  const [viewId, setViewId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string>("");
  const [deleting, setDeleting] = useState(false);

  // status-note modal
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteBusy, setNoteBusy] = useState(false);
  const [noteTarget, setNoteTarget] = useState<{ id: string; clubName: string } | null>(null);
  const [noteStatus, setNoteStatus] = useState<"under-review" | "pending-docs" | "rejected">("under-review");
  const [noteDefaults, setNoteDefaults] = useState<{ title: string; label: string; placeholder: string; submitLabel: string; defaultValue: string }>({
    title: "",
    label: "Message",
    placeholder: "Type your message…",
    submitLabel: "Send",
    defaultValue: "",
  });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [{ data: list }, { data: cts }] = await Promise.all([
        API.get("/club-applications", { params: { status, q, page, limit } }),
        API.get("/club-applications/_counts"),
      ]);
      setData(list);
      setCounts(cts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); /* eslint-disable-next-line */ }, [status, q, page, limit]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil((data.total || 0) / limit)), [data.total, limit]);

  const refreshCounts = async () => {
    try {
      const { data: cts } = await API.get("/club-applications/_counts");
      setCounts(cts);
    } catch {}
  };

  const action = async (id: string, newStatus: Item["status"], notes?: string) => {
    try {
      await API.patch(`/club-applications/${id}/status`, { status: newStatus, notes });
      setData((prev) => ({ ...prev, items: prev.items.map(i => i._id === id ? { ...i, status: newStatus } : i) }));
      fetchAll();
      refreshCounts();
    } catch (e) {
      console.error(e);
      alert("Failed to update status");
    }
  };

  const openDelete = (id: string, clubName: string) => {
    setDeleteId(id);
    setDeleteName(clubName);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await API.delete(`/club-applications/${deleteId}`);
      setData(prev => ({ ...prev, items: prev.items.filter(i => i._id !== deleteId), total: Math.max(0, prev.total - 1) }));
      setDeleteId(null);
      setDeleteName("");
      refreshCounts();
    } catch (e) {
      console.error(e);
      alert("Failed to delete application");
    } finally {
      setDeleting(false);
    }
  };

  // open note modal helpers
  const askUnderReview = (id: string, clubName: string) => {
    setNoteTarget({ id, clubName });
    setNoteStatus("under-review");
    setNoteDefaults({
      title: "Notify: Under Review",
      label: "Message to applicant",
      placeholder: "Your application is currently under review...",
      submitLabel: "Send Notification",
      defaultValue: "Your club application is currently under review. We will update you once the review is complete.",
    });
    setNoteOpen(true);
  };

  const askPendingDocs = (id: string, clubName: string) => {
    setNoteTarget({ id, clubName });
    setNoteStatus("pending-docs");
    setNoteDefaults({
      title: "Request Additional Documents",
      label: "Which documents do you need?",
      placeholder: "e.g., Audited financial statements for 2024; Stadium safety certificate...",
      submitLabel: "Request Documents",
      defaultValue: "",
    });
    setNoteOpen(true);
  };

  const askRejected = (id: string, clubName: string) => {
    setNoteTarget({ id, clubName });
    setNoteStatus("rejected");
    setNoteDefaults({
      title: "Reject Application",
      label: "Reason for rejection",
      placeholder: "Please provide a clear reason for rejection...",
      submitLabel: "Send Rejection",
      defaultValue: "",
    });
    setNoteOpen(true);
  };

  const submitNote = async (note: string) => {
    if (!noteTarget) return;
    try {
      setNoteBusy(true);
      await action(noteTarget.id, noteStatus, note);
      setNoteOpen(false);
      setNoteTarget(null);
    } finally {
      setNoteBusy(false);
    }
  };

  const dl = (id: string, kind: "constitution" | "clubLicense" | "contactId" | "supporting", index?: number) =>
    `${(import.meta.env.VITE_API_URL || "").replace(/\/+$/, "")}/club-applications/${id}/download/${kind}${index !== undefined ? `/${index}` : ""}`;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Club Applications</h1>
          <p className="text-muted-foreground">Review and process new club registration applications</p>
        </div>
        <Badge variant="outline" className="bg-warning/10 text-warning border-warning">
          {counts ? (counts.underReview + counts.pendingDocs) : 0} Pending Review
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          className="bg-background border border-input rounded-md px-3 py-2 text-sm"
          value={status}
          onChange={(e) => { setStatus(e.target.value as any); setPage(1); }}
        >
          <option value="all">All Applications</option>
          <option value="under-review">Under Review</option>
          <option value="pending-docs">Pending Documents</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            className="bg-background border border-input rounded-md pl-9 pr-3 py-2 text-sm"
            placeholder="Search by club, contact, location…"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading && <div className="text-sm text-muted-foreground">Loading…</div>}

        {data.items.map((app) => (
          <div key={app._id} className="bg-card rounded-lg border border-border p-6 shadow-card">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <div>
                    <h3 className="font-semibold text-card-foreground text-lg">{app.clubName}</h3>
                    <p className="text-sm text-muted-foreground">{app.location || "—"}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {app.applicant || "—"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(app.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {Number(app.documents.supporting || 0) + (app.documents.constitution ? 1 : 0) + (app.documents.clubLicense ? 1 : 0) + (app.documents.contactId ? 1 : 0)} documents
                    </div>
                  </div>

                  {/* Document download chips (fixed) */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {app.documents.constitution && (
                      <a href={dl(app._id, "constitution")} target="_blank" rel="noopener noreferrer">
                        <Badge variant="outline">Constitution</Badge>
                      </a>
                    )}
                    {app.documents.clubLicense && (
                      <a href={dl(app._id, "clubLicense")} target="_blank" rel="noopener noreferrer">
                        <Badge variant="outline">Club License</Badge>
                      </a>
                    )}
                    {app.documents.contactId && (
                      <a href={dl(app._id, "contactId")} target="_blank" rel="noopener noreferrer">
                        <Badge variant="outline">Contact ID</Badge>
                      </a>
                    )}
                    {app.documents.supporting > 0 &&
                      Array.from({ length: app.documents.supporting }, (_, i) => (
                        <a key={i} href={dl(app._id, "supporting", i)} target="_blank" rel="noopener noreferrer">
                          <Badge variant="outline">Supporting {i + 1}</Badge>
                        </a>
                      ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge className={statusClass(app.status)}>
                  {STATUS_LABEL[app.status]}
                </Badge>

                {/* Under Review → send message */}
                <Button variant="outline" size="sm" onClick={() => askUnderReview(app._id, app.clubName)}>
                  Under Review
                </Button>

                {/* actions */}
                <Button variant="success" size="sm" onClick={() => action(app._id, "approved")}>Approve</Button>
                <Button variant="destructive" size="sm" onClick={() => askRejected(app._id, app.clubName)}>Reject</Button>
                <Button variant="warning" size="sm" onClick={() => askPendingDocs(app._id, app.clubName)}>Request Docs</Button>

                {/* view/delete */}
                <Button variant="ghost" size="icon" title="View" onClick={() => setViewId(app._id)}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" title="Delete" onClick={() => openDelete(app._id, app.clubName)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && data.items.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-card-foreground mb-2">No applications found</h3>
          <p className="text-muted-foreground">Try a different status or search term.</p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-sm text-muted-foreground">
          Page {page} of {totalPages} • {data.total} total
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>

      {/* Modals */}
      <ViewClubResgistrationModal open={!!viewId} id={viewId} onClose={() => setViewId(null)} />

      <DeleteModal
        open={!!deleteId}
        title="Delete Application"
        description={`This will permanently delete "${deleteName}".`}
        confirmLabel="Delete"
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        confirming={deleting}
      />

      <StatusNoteModal
        open={noteOpen}
        title={noteDefaults.title}
        label={noteDefaults.label}
        placeholder={noteDefaults.placeholder}
        submitLabel={noteDefaults.submitLabel}
        defaultValue={noteDefaults.defaultValue}
        onCancel={() => setNoteOpen(false)}
        onSubmit={submitNote}
        busy={noteBusy}
      />
    </div>
  );
}
