import { ChangeEvent } from "react";
import { useClubForm, ROLES } from "../ClubAppFormContext";

export default function Step2Contact(): JSX.Element {
  const { s2, setS2 } = useClubForm();

  const on = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setS2((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Contact Information</h2>
        <p className="text-sm text-slate-500">Primary contact person details</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Contact Person Name <span className="text-red-500">*</span>
          </label>
          <input
            name="contactName"
            value={s2.contactName}
            onChange={on}
            placeholder="Full name"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Role/Position <span className="text-red-500">*</span>
          </label>
          <select
            name="contactRole"
            value={s2.contactRole}
            onChange={on}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
          >
            <option value="" disabled>Select role</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            name="contactEmail"
            type="email"
            value={s2.contactEmail}
            onChange={on}
            placeholder="contact@clubname.zm"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            name="contactPhone"
            value={s2.contactPhone}
            onChange={on}
            placeholder="+260 XXX XXX XXX"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
          />
        </div>

        <div className="md:col-span-2 mt-2 h-px bg-slate-200" />
      </div>
    </section>
  );
}
