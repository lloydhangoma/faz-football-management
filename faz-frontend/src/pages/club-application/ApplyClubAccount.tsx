import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Step1ClubInfo from "./steps/Step1ClubInfo";
import Step2Contact from "./steps/Step2Contact";
import Step3Officials from "./steps/Step3Officials";
import Step4Documents from "./steps/Step4Documents";
import Step5Review from "./steps/Step5Review";
import { ClubAppFormProvider } from "./ClubAppFormContext";

export type StepIndex = 1 | 2 | 3 | 4 | 5;

const STEPS = [
  { id: 1 as const, title: "Club Information", blurb: "Basic information about your football club" },
  { id: 2 as const, title: "Contact Details",   blurb: "Primary contact for this application" },
  { id: 3 as const, title: "Officials",          blurb: "Key officials associated with the club" },
  { id: 4 as const, title: "Documents",          blurb: "Upload required documents (placeholders)" },
  { id: 5 as const, title: "Review & Submit",    blurb: "Review your details and submit" },
];

export default function ApplyClubAccount(): JSX.Element {
  const [step, setStep] = useState<StepIndex>(1);
  const percent = useMemo(() => Math.round((step / STEPS.length) * 100), [step]);

  const next  = () => setStep((s) => (Math.min(5, s + 1) as StepIndex));
  const prev  = () => setStep((s) => (Math.max(1, s - 1) as StepIndex));
  const goTo  = (s: StepIndex) => setStep(s);

  return (
    <ClubAppFormProvider>
      {/* Minimal sticky header with Back to Home */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-green-300 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800"
            aria-label="Back to home"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-3xl font-bold text-center">Apply for Club Account</h1>
        <p className="mt-1 text-center text-slate-600">
          Join the Football Association of Zambia platform and connect with the football community
        </p>

        {/* Progress */}
        <div className="mx-auto mt-6 max-w-xl text-center text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span>Step {step} of 5</span>
            <span>{percent}% Complete</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-200">
            <div
              className="h-2 rounded-full bg-green-600 transition-all"
              style={{ width: `${percent}%` }}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
            />
          </div>
        </div>

        {/* Stepper */}
        <ol className="mt-6 grid grid-cols-5 gap-2 text-center text-[11px] font-medium text-slate-600">
          {STEPS.map((s) => {
            const isActive = s.id === step;
            const canJump = s.id <= step; // allow going back (not forward)
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => canJump && goTo(s.id)}
                  className={[
                    "w-full rounded-md px-2 py-1.5",
                    isActive ? "bg-green-600 text-white" : "bg-slate-100 hover:bg-slate-200",
                    !canJump && "cursor-not-allowed opacity-60",
                  ].filter(Boolean).join(" ")}
                  aria-current={isActive ? "step" : undefined}
                >
                  {s.title}
                </button>
              </li>
            );
          })}
        </ol>

        {/* Card */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-lg font-semibold">{STEPS.find((x) => x.id === step)?.title}</h2>
            <p className="text-xs text-slate-500">{STEPS.find((x) => x.id === step)?.blurb}</p>
          </div>

          <div className="px-6 py-5">
            {step === 1 && <Step1ClubInfo />}
            {step === 2 && <Step2Contact />}
            {step === 3 && <Step3Officials />}
            {step === 4 && <Step4Documents />}
            {step === 5 && <Step5Review />}
          </div>

          {/* Global frame footer controls navigation */}
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
            <button
              type="button"
              onClick={prev}
              disabled={step === 1}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            {step < 5 ? (
              <button
                type="button"
                onClick={next}
                className="inline-flex items-center gap-2 rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </ClubAppFormProvider>
  );
}
