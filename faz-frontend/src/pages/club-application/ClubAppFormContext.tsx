import React, { createContext, useContext, useMemo, useState } from "react";

export const ROLES = [
  "Coach","Assistant Coach","Manager","Chairperson","Secretary","Treasurer","Medical Officer","Kit Manager",
] as const;
export type Role = typeof ROLES[number];

export type Step1State = {
  clubName: string;
  yearFounded?: string;
  province?: string;
  district?: string;
  address: string;
  licenseNumber?: string;
};

export type Step2State = {
  contactName: string;
  contactRole: Role | "";
  contactEmail: string;
  contactPhone: string;
};

export type Official = { id: string; fullName: string; role: Role | ""; nrc: string };
export type Step3State = { officials: Official[] };

export type Step4Files = {
  constitution?: File | null;
  clubLicense?: File | null;
  contactId?: File | null;
  supporting: File[];
  names: {
    constitutionName?: string;
    clubLicenseName?: string;
    contactIdName?: string;
    supportingNames: string[];
  }
};

type Ctx = {
  s1: Step1State; setS1: React.Dispatch<React.SetStateAction<Step1State>>;
  s2: Step2State; setS2: React.Dispatch<React.SetStateAction<Step2State>>;
  s3: Step3State; setS3: React.Dispatch<React.SetStateAction<Step3State>>;
  files: Step4Files; setFiles: React.Dispatch<React.SetStateAction<Step4Files>>;
};

const ClubAppFormContext = createContext<Ctx | null>(null);

export function ClubAppFormProvider({ children }: { children: React.ReactNode }) {
  const [s1, setS1] = useState<Step1State>({
    clubName: "", yearFounded: "", province: "", district: "", address: "", licenseNumber: ""
  });
  const [s2, setS2] = useState<Step2State>({
    contactName: "", contactRole: "", contactEmail: "", contactPhone: ""
  });
  const [s3, setS3] = useState<Step3State>({
    officials: [{ id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), fullName: "", role: "", nrc: "" }]
  });
  const [files, setFiles] = useState<Step4Files>({
    constitution: null, clubLicense: null, contactId: null, supporting: [],
    names: { constitutionName: "", clubLicenseName: "", contactIdName: "", supportingNames: [] }
  });

  const value = useMemo(() => ({ s1, setS1, s2, setS2, s3, setS3, files, setFiles }), [s1, s2, s3, files]);
  return <ClubAppFormContext.Provider value={value}>{children}</ClubAppFormContext.Provider>;
}

export const useClubForm = () => {
  const ctx = useContext(ClubAppFormContext);
  if (!ctx) throw new Error("useClubForm must be used within ClubAppFormProvider");
  return ctx;
};
