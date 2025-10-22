
import { useClubForm, ROLES } from "../ClubAppFormContext";
import type { Role } from "../ClubAppFormContext";

import { FiPlus, FiX } from "react-icons/fi";

const uid = () => crypto.randomUUID?.() || Math.random().toString(36).slice(2);

export default function Step3Officials(): JSX.Element {
  const { s3, setS3 } = useClubForm();

  const setOfficial = (id: string, patch: Partial<typeof s3.officials[number]>) =>
    setS3((prev) => ({ officials: prev.officials.map(o => (o.id === id ? { ...o, ...patch } : o)) }));

  const addOfficial = () =>
    setS3((prev) => ({ officials: [...prev.officials, { id: uid(), fullName: "", role: "", nrc: "" }] }));

  const removeOfficial = (id: string) =>
    setS3((prev) => (prev.officials.length <= 1 ? prev : { officials: prev.officials.filter(o => o.id !== id) }));

  return (
    <section>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Club Officials</h2>
          <p className="text-sm text-slate-500">Add your club officials and staff</p>
        </div>
        <button
          type="button"
          onClick={addOfficial}
          className="inline-flex items-center gap-2 rounded-full border border-green-600 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50"
        >
          <FiPlus className="h-4 w-4" />
          Add Official
        </button>
      </div>

      <h3 className="mt-6 mb-3 font-semibold">Club Officials</h3>

      <div className="space-y-4">
        {s3.officials.map((o) => (
          <div key={o.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={o.fullName}
                  onChange={(e) => setOfficial(o.id, { fullName: e.target.value })}
                  placeholder="Full name"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={o.role}
                  onChange={(e) => setOfficial(o.id, { role: e.target.value as Role })}
                  className="w-full appearance-none rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                >
                  <option value="" disabled>Select role</option>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">NRC/ID Number</label>
                <div className="relative">
                  <input
                    value={o.nrc}
                    onChange={(e) => setOfficial(o.id, { nrc: e.target.value })}
                    placeholder="NRC/ID number"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                  />
                  <button
                    type="button"
                    onClick={() => removeOfficial(o.id)}
                    disabled={s3.officials.length <= 1}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-md border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                    aria-label="Remove official"
                    title="Remove official"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
