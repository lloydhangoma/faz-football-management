import { useEffect, useRef, useState, ChangeEvent, DragEvent } from "react";
import { FiUpload, FiFileText } from "react-icons/fi";
import { useClubForm } from "../ClubAppFormContext";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

export default function Step4Documents(): JSX.Element {
  const { files, setFiles } = useClubForm();

  const setSingle = (key: "constitution" | "clubLicense" | "contactId", f: File | null, label?: string) =>
    setFiles((prev) => ({
      ...prev,
      [key]: f,
      names: { ...prev.names, [`${key}Name`]: label || "" } as any
    }));

  const setMultiple = (arr: File[], names: string[]) =>
    setFiles((prev) => ({ ...prev, supporting: arr, names: { ...prev.names, supportingNames: names } }));

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Upload Documents</h2>
        <p className="text-sm text-slate-500">Required documentation for verification</p>
      </div>

      <div className="mb-6 grid place-items-center text-slate-600">
        <FiUpload className="h-10 w-10" />
        <div className="mt-2 font-medium">Upload Required Documents</div>
        <p className="text-xs text-slate-500">All documents should be in PDF format, maximum 5MB each</p>
      </div>

      <div className="space-y-6">
        <Dropzone
          id="constitution"
          label="Proof of Registration / Constitution"
          required
          accept="application/pdf"
          multiple={false}
          names={files.names.constitutionName ? [files.names.constitutionName] : []}
          onFiles={(fs) => setSingle("constitution", fs[0] || null, fs[0]?.name)}
          onClear={() => setSingle("constitution", null, "")}
        />

        <Dropzone
          id="license"
          label="Club License (if existing)"
          accept="application/pdf"
          multiple={false}
          names={files.names.clubLicenseName ? [files.names.clubLicenseName] : []}
          onFiles={(fs) => setSingle("clubLicense", fs[0] || null, fs[0]?.name)}
          onClear={() => setSingle("clubLicense", null, "")}
        />

        <Dropzone
          id="contactId"
          label="Official ID of Contact Person"
          required
          accept="application/pdf,image/*"
          multiple={false}
          names={files.names.contactIdName ? [files.names.contactIdName] : []}
          onFiles={(fs) => setSingle("contactId", fs[0] || null, fs[0]?.name)}
          onClear={() => setSingle("contactId", null, "")}
        />

        <Dropzone
          id="supporting"
          label="Supporting Documents (Optional)"
          accept="application/pdf,image/*"
          multiple
          names={files.names.supportingNames || []}
          onFiles={(fs) => setMultiple(fs, fs.map((f) => f.name))}
          onClear={() => setMultiple([], [])}
        />
      </div>
    </section>
  );
}

/* ---------- Reusable Dropzone ---------- */
type DZProps = {
  id: string;
  label: string;
  required?: boolean;
  accept: string;
  multiple?: boolean;
  names: string[];
  onFiles: (files: File[]) => void;
  onClear: () => void;
};

function Dropzone({ id, label, required, accept, multiple, names, onFiles, onClear }: DZProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const pick = () => inputRef.current?.click();

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const cleaned = validateFiles(files, accept);
    if (cleaned.length) onFiles(cleaned);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files || []);
    const cleaned = validateFiles(files, accept);
    if (cleaned.length) onFiles(cleaned);
  };

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={[
          "rounded-xl border-2 border-dashed p-8 text-center transition",
          dragOver ? "border-green-600 bg-green-50" : "border-slate-200 bg-white",
        ].join(" ")}
        role="button"
        tabIndex={0}
        onClick={pick}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " " ? pick() : null)}
      >
        <FiFileText className="mx-auto h-8 w-8 text-slate-400" />
        <p className="mt-2 text-sm text-slate-600">Drag and drop your file here, or click to browse</p>
        <div className="mt-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium">
          Choose File
        </div>

        <input
          id={id}
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={!!multiple}
          className="hidden"
          onChange={handleInput}
        />
      </div>

      {names && names.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {names.map((n, i) => (
            <span
              key={`${n}-${i}`}
              className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700"
            >
              {n}
            </span>
          ))}
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-slate-600 underline hover:text-slate-800"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- helpers ---------- */
function validateFiles(files: File[], accept: string): File[] {
  const allowPdf = accept.includes("application/pdf");
  const allowImages = accept.includes("image/*");

  const okType = (f: File) =>
    (allowPdf && f.type === "application/pdf") ||
    (allowImages && f.type.startsWith("image/"));

  const cleaned: File[] = [];
  for (const f of files) {
    if (!okType(f)) {
      alert(`❌ "${f.name}" is not an accepted type.`);
      continue;
    }
    if (f.size > MAX_BYTES) {
      alert(`❌ "${f.name}" is larger than 5MB.`);
      continue;
    }
    cleaned.push(f);
  }
  return cleaned;
}
