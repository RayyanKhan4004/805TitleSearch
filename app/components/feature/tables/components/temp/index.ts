import type {
  SharedState,
} from "@/app/components/feature/tables/types";

export interface CatxCode {
  code: string;
  label: string;
  verbiage: string;
}

export const ABBR_MAP = [
  { abbr: "GD", full: "Grant Deed" },
  { abbr: "QCD", full: "Quitclaim Deed" },
  { abbr: "TDEED", full: "Trustee's Deed" },
  { abbr: "TDURS", full: "Trustee's Deed Upon Rec. of Sale" },
  { abbr: "AFF", full: "Affidavit" },
  { abbr: "DOT", full: "Deed of Trust" },
  { abbr: "MTG", full: "Mortgage" },
  { abbr: "ASGN", full: "Assignment of DOT" },
  { abbr: "MOD", full: "Modification of DOT" },
  { abbr: "RECON", full: "Reconveyance" },
  { abbr: "SOT", full: "Substitution of Trustee" },
  { abbr: "SOT/R", full: "Sub. of Trustee & Reconveyance" },
  { abbr: "MECH", full: "Mechanic's Lien" },
  { abbr: "JUDG", full: "Judgment Lien" },
  { abbr: "UCC", full: "UCC Filing" },
  { abbr: "BANKR", full: "Bankruptcy" },
  { abbr: "PROB", full: "Probate" },
  { abbr: "EASE", full: "Easement" },
  { abbr: "CCR", full: "CC&Rs" },
  { abbr: "REST", full: "Restriction" },
  { abbr: "NOD", full: "Notice of Default" },
  { abbr: "NTS", full: "Notice of Trustee Sale" },
  { abbr: "NOC", full: "Notice of Completion" },
  { abbr: "NTC", full: "Notice" },
  { abbr: "AGR", full: "Agreement" },
  { abbr: "MEMO", full: "Memorandum" },
  { abbr: "CERT", full: "Certificate" },
  { abbr: "ORD", full: "Order" },
];

export const DOC_ENTITIES = [
  { value: "XFER", label: "Transfers" },
  { value: "DOT", label: "DOTs" },
  { value: "LIEN", label: "Liens & Judgments" },
  { value: "EASE", label: "Easements & Restrictions" },
  { value: "MISC", label: "Miscellaneous" },
  { value: "BANKR", label: "Bankruptcy / Probate" },
];

export const DOC_TYPES = [
  "Grant Deed",
  "Quitclaim Deed",
  "Affidavit",
  "Trustee Deed",
  "Transfer Deed",
  "Deed of Trust",
  "Mortgage",
  "Assignment",
  "Substitution of Trustee",
  "Reconveyance",
  "UCC Filing",
  "Mechanic's Lien",
  "Judgment Lien",
  "Bankruptcy",
  "Probate",
  "Agreement",
  "Memorandum",
  "Notice",
  "Easement",
  "Restriction",
  "CC&Rs",
  "Notice of Completion",
];

export const DOC_TITLES = [
  "Quitclaim Deed",
  "Grant Deed",
  "Trustee's Deed",
  "Trustee's Deed Upon Rec. of Sale",
  "Affidavit",
  "Deed of Trust",
  "Mortgage",
  "Assignment of DOT",
  "Modification of DOT",
  "Reconveyance",
  "Substitution of Trustee",
  "Sub. of Trustee & Reconveyance",
  "Mechanic's Lien",
  "Judgment Lien",
  "UCC Filing",
  "Bankruptcy",
  "Probate",
  "Easement",
  "CC&Rs",
  "Restriction",
  "Notice of Default",
  "Notice of Trustee Sale",
  "Notice of Completion",
  "Notice",
  "Agreement",
  "Memorandum",
  "Certificate",
  "Order",
];

export const INIT_DOCS: { name: string; date: string; size: string; type: "document" | "template" }[] = [];

export const INIT_NOTES: { author: string; date: string; text: string }[] = [];

export const PRELIM_REPORT_BODY = "";

export const ALTA_COMMITMENT_BODY = "";

export const CLTA_COMMITMENT_BODY = "";

export const FINAL_POLICY_BODY = "";

export const EXAMPLE_TEMPLATES: { id: string; name: string; desc: string; icon: string; color: string; badge: string; body: string }[] = [];

export const RECIPIENTS = [
  { value: "title_officer", label: "Title Officer" },
  { value: "client", label: "Client" },
  { value: "escrow_officer", label: "Escrow Officer" },
  { value: "lender", label: "Lender" },
  { value: "custom", label: "Custom Recipient" },
];

export const CATX_CODES: CatxCode[] = [];

export const PREFILLS: Record<string, { name: string; email: string }> = {};

export const BOIL1 = "";

export const BOIL2 = "";

export const EMPTY_SHARED_STATE: SharedState = {
  vesting: "",
  legal: "",
  leaseHold: "",
  effectiveDate: "",
  typeDate: "",
  chainCodes: [],
  areaType: "",
  cityName: "",
  townshipName: "",
  unincorporatedName: "",
  propertyClassification: "",
};

export interface UploadCatField {
  k: string;
  lbl: string;
  t: string;
  ph: string;
  opts?: string[];
}

export interface UploadCat {
  key: string;
  label: string;
  accent: string;
  fields: UploadCatField[];
}

export const UPLOAD_CATS: UploadCat[] = [];
