import { ChangeEvent } from "react";
import { useClubForm } from "../ClubAppFormContext";

const PROVINCES = [
  "Central","Copperbelt","Eastern","Luapula","Lusaka","Muchinga",
  "Northern","North-Western","Southern","Western",
] as const;

export default function Step1ClubInfo(): JSX.Element {
  const { s1, setS1 } = useClubForm();

  const on = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setS1((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label className="mb-1 block text-sm font-medium">
          Club Name <span className="text-red-500">*</span>
        </label>
        <input name="clubName" value={s1.clubName} onChange={on} placeholder="Enter club name"
               className="w-full rounded-md border border-slate-300 px-3 py-2" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Year Founded</label>
        <input name="yearFounded" value={s1.yearFounded} onChange={on} placeholder="e.g., 1995"
               className="w-full rounded-md border border-slate-300 px-3 py-2" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Province <span className="text-red-500">*</span>
        </label>
        <select name="province" value={s1.province} onChange={on}
                className="w-full rounded-md border border-slate-300 px-3 py-2">
          <option value="">Select province</option>
          {PROVINCES.map((p) => (<option key={p} value={p}>{p}</option>))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          District <span className="text-red-500">*</span>
        </label>
        <input name="district" value={s1.district} onChange={on} placeholder="Enter district"
               className="w-full rounded-md border border-slate-300 px-3 py-2" />
      </div>

      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium">
          Physical Address <span className="text-red-500">*</span>
        </label>
        <textarea name="address" value={s1.address} onChange={on} placeholder="Enter full physical address"
                  className="w-full rounded-md border border-slate-300 px-3 py-2" rows={3} />
      </div>

      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium">License Number (Optional)</label>
        <input name="licenseNumber" value={s1.licenseNumber} onChange={on}
               placeholder="Enter existing license number if any"
               className="w-full rounded-md border border-slate-300 px-3 py-2" />
      </div>
    </div>
  );
}
