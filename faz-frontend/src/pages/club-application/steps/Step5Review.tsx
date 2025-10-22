import { useMemo } from "react";
import { useClubForm } from "../ClubAppFormContext";
import { API } from "../../../api/client";

export default function Step5Review(): JSX.Element {
  const { s1, s2, s3, files } = useClubForm();

  const docsCount = useMemo(() => {
    let n = 0;
    if (files.constitution) n++;
    if (files.clubLicense) n++;
    if (files.contactId) n++;
    n += files.supporting.length;
    return n;
  }, [files]);

  const submit = async () => {
    const required = [
      ["Club Name", s1.clubName],
      ["Province", s1.province],
      ["District", s1.district],
      ["Address", s1.address],
      ["Contact Name", s2.contactName],
      ["Contact Email", s2.contactEmail],
    ];
    for (const [label, val] of required) {
      if (!val) { alert(`Please fill: ${label}`); return; }
    }
    if (!files.constitution) return alert("Please upload the Constitution PDF.");
    if (!files.contactId)   return alert("Please upload the Contact Person ID.");

    const payload = {
      ...s1,
      ...s2,
      officials: s3.officials.filter(o => o.fullName?.trim()),
    };

    const fd = new FormData();
    fd.append("payload", JSON.stringify(payload));
    if (files.constitution) fd.append("constitution", files.constitution, files.constitution.name);
    if (files.clubLicense)  fd.append("clubLicense",  files.clubLicense,  files.clubLicense.name);
    if (files.contactId)    fd.append("contactId",    files.contactId,    files.contactId.name);
    for (const f of files.supporting) fd.append("supporting", f, f.name);

    try {
      const { data } = await API.post("/club-applications", fd, { headers: { "Content-Type": "multipart/form-data" } });
      alert("✅ Submitted! Reference: " + data._id);
      // TODO: navigate("/thank-you", { state: { id: data._id } })
    } catch (e: any) {
      alert("❌ Submission failed: " + (e?.response?.data?.message || e.message));
    }
  };

  const Row = ({ label, value }: { label: string; value?: string }) => (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="text-sm text-slate-600">{label}</div>
      <div className="text-sm font-medium text-slate-900">{value || "—"}</div>
    </div>
  );

  const RowList = ({ label, values }: { label: string; values: string[] }) => (
    <div className="py-2">
      <div className="mb-1 text-sm text-slate-600">{label}</div>
      {values.length ? (
        <div className="flex flex-wrap gap-2">
          {values.map((v, i) => (
            <span key={`${v}-${i}`} className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700">
              {v}
            </span>
          ))}
        </div>
      ) : (
        <div className="text-sm font-medium text-slate-900">—</div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Club Information */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-700">Club Information</h3>
        <div className="rounded-lg border border-slate-200 p-4">
          <Row label="Club Name" value={s1.clubName} />
          <Row label="Year Founded" value={s1.yearFounded} />
          <Row label="Province" value={s1.province} />
          <Row label="District" value={s1.district} />
          <Row label="Address" value={s1.address} />
          <Row label="License No." value={s1.licenseNumber} />
        </div>
      </div>

      {/* Contact + Documents */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-700">Contact & Documents</h3>
        <div className="rounded-lg border border-slate-200 p-4">
          <Row label="Contact Name" value={s2.contactName} />
          <Row label="Role/Position" value={s2.contactRole} />
          <Row label="Email Address" value={s2.contactEmail} />
          <Row label="Phone Number" value={s2.contactPhone} />
          <div className="my-2 h-px bg-slate-100" />
          <Row label="Constitution" value={files.names.constitutionName} />
          <Row label="Club License" value={files.names.clubLicenseName} />
          <Row label="Contact Person ID" value={files.names.contactIdName} />
          <RowList label="Supporting Documents" values={files.names.supportingNames || []} />
          <div className="mt-2 text-xs text-slate-500">{docsCount} file(s) attached</div>
        </div>
      </div>

      {/* Officials (full width) */}
      <div className="md:col-span-2">
        <h3 className="mb-2 text-sm font-semibold text-slate-700">Officials</h3>
        <div className="rounded-lg border border-slate-200 p-4">
          {s3.officials.length === 0 ? (
            <div className="text-sm text-slate-500">No officials added.</div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-slate-600">
                <div>Role</div>
                <div>Name</div>
                <div>NRC/ID</div>
              </div>
              {s3.officials.map((o, idx) => (
                <div key={o.id || idx} className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-slate-700">{o.role || "Official"}</div>
                  <div className="font-medium text-slate-900">{o.fullName || "—"}</div>
                  <div className="text-slate-600">{o.nrc || "—"}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="md:col-span-2 flex justify-end">
        <button
          onClick={submit}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
        >
          Submit Application
        </button>
      </div>
    </div>
  );
}
