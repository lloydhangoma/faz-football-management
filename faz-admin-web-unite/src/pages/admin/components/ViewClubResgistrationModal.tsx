// 📁 src/pages/admin/components/ViewClubResgistrationModal.tsx
import { useEffect, useState } from "react";
import { API } from "@/api/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Building2, User, Mail, Phone, MapPin, FileText } from "lucide-react";

type DocLite = { fileName?: string; fileType?: string; fileSize?: number; hasAsset?: boolean };
type Official = { fullName: string; role?: string; nrc?: string };

type DetailResp = {
  _id: string;
  clubName: string;
  yearFounded?: string;
  province: string;
  district: string;
  address: string;
  licenseNumber?: string;
  contactName: string;
  contactRole?: string;
  contactEmail: string;
  contactPhone?: string;
  officials: Official[];
  documents: {
    constitution?: DocLite;
    clubLicense?: DocLite;
    contactId?: DocLite;
    supporting: DocLite[];
  };
  status: "under-review" | "pending-docs" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
};

const STATUS_LABEL: Record<DetailResp["status"], string> = {
  "under-review": "Under Review",
  "pending-docs": "Pending Documents",
  approved: "Approved",
  rejected: "Rejected",
};
const statusClass = (s: DetailResp["status"]) => {
  switch (s) {
    case "approved": return "bg-success text-success-foreground";
    case "under-review": return "bg-info text-info-foreground";
    case "pending-docs": return "bg-warning text-warning-foreground";
    case "rejected": return "bg-destructive text-destructive-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

function dlBase() {
  return (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
}
const dl = (
  id: string,
  kind: "constitution" | "clubLicense" | "contactId" | "supporting",
  index?: number
) => `${dlBase()}/club-applications/${id}/download/${kind}${index !== undefined ? `/${index}` : ""}`;

export default function ViewClubResgistrationModal({
  open,
  id,
  onClose,
}: {
  open: boolean;
  id: string | null;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DetailResp | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      if (!open || !id) return;
      setLoading(true);
      try {
        const { data } = await API.get<DetailResp>(`/club-applications/${id}`);
        if (alive) setData(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, [open, id]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-x-0 top-10 mx-auto w-full max-w-3xl rounded-xl bg-card text-card-foreground shadow-xl border border-border">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">{data?.clubName || "Club Application"}</h3>
          </div>
          {data && <Badge className={statusClass(data.status)}>{STATUS_LABEL[data.status]}</Badge>}
          <button onClick={onClose} className="ml-3 rounded-md p-1 hover:bg-muted">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto px-5 py-4 space-y-6">
          {loading && <div className="text-sm text-muted-foreground">Loading…</div>}

          {data && (
            <>
              {/* Club info */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-border p-4">
                  <h4 className="text-sm font-semibold mb-2">Club Information</h4>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="text-muted-foreground">Year Founded:</span>{" "}
                      {data.yearFounded || "—"}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Province/District:</span>{" "}
                      {data.province}, {data.district}
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                      <span>{data.address || "—"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">License No.:</span>{" "}
                      {data.licenseNumber || "—"}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <h4 className="text-sm font-semibold mb-2">Primary Contact</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" /> {data.contactName}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Role:</span>{" "}
                      {data.contactRole || "—"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" /> {data.contactEmail}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" /> {data.contactPhone || "—"}
                    </div>
                  </div>
                </div>
              </section>

              {/* Officials */}
              <section className="rounded-lg border border-border p-4">
                <h4 className="text-sm font-semibold mb-2">Officials</h4>
                {data.officials?.length ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-muted-foreground">
                      <div>Role</div>
                      <div>Name</div>
                      <div>NRC/ID</div>
                    </div>
                    {data.officials.map((o, idx) => (
                      <div key={idx} className="grid grid-cols-3 gap-2 text-sm">
                        <div>{o.role || "Official"}</div>
                        <div className="font-medium">{o.fullName}</div>
                        <div className="text-muted-foreground">{o.nrc || "—"}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No officials listed.</div>
                )}
              </section>

              {/* Documents */}
              <section className="rounded-lg border border-border p-4">
                <h4 className="text-sm font-semibold mb-2">Documents</h4>
                <div className="flex flex-wrap gap-2">
                  {data.documents?.constitution?.hasAsset && (
                    <a
                      href={dl(data._id, "constitution")}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Badge variant="outline">Constitution</Badge>
                    </a>
                  )}
                  {data.documents?.clubLicense?.hasAsset && (
                    <a
                      href={dl(data._id, "clubLicense")}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Badge variant="outline">Club License</Badge>
                    </a>
                  )}
                  {data.documents?.contactId?.hasAsset && (
                    <a
                      href={dl(data._id, "contactId")}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Badge variant="outline">Contact ID</Badge>
                    </a>
                  )}
                  {Array.isArray(data.documents?.supporting) &&
                    data.documents.supporting.map((d, i) =>
                      d?.hasAsset ? (
                        <a
                          key={i}
                          href={dl(data._id, "supporting", i)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Badge variant="outline">Supporting {i + 1}</Badge>
                        </a>
                      ) : null
                    )}

                  {!data.documents?.constitution?.hasAsset &&
                    !data.documents?.clubLicense?.hasAsset &&
                    !data.documents?.contactId?.hasAsset &&
                    !(data.documents?.supporting || []).length && (
                      <div className="text-sm text-muted-foreground">
                        No documents uploaded.
                      </div>
                    )}
                </div>
              </section>
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border px-4 py-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
