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
  key: string;
  label: string;
  type: string;
  placeholder: string;
  options?: string[];
}

export interface UploadCat {
  key: string;
  label: string;
  accent: string;
  fields: UploadCatField[];
}

const FIELDS: Record<string, UploadCatField[]> = {
  "Assessor Page": [
    { key: "apn", label: "APN", type: "text", placeholder: "107-0-330-755" },
    { key: "owner", label: "Owner Name", type: "text", placeholder: "RODRIGUEZ RAQUEL" },
    { key: "address", label: "Situs Address", type: "text", placeholder: "2012 HARVEST LOOP, SANTA PAULA, CA" },
    { key: "assessed", label: "Assessed Value", type: "text", placeholder: "$652,575" },
    { key: "taxYear", label: "Tax Year", type: "text", placeholder: "2025" },
    { key: "landUse", label: "Land Use", type: "text", placeholder: "CONDOMINIUM" },
  ],
  "Assessor Map": [
    { key: "mapRef", label: "Map Reference", type: "text", placeholder: "169MR34" },
    { key: "parcelNo", label: "Parcel No.", type: "text", placeholder: "107-0-330-755" },
    { key: "mapDate", label: "Map Date", type: "date", placeholder: "" },
    { key: "notes", label: "Notes", type: "textarea", placeholder: "Map notes or page reference" },
  ],
  "Tract Map": [
    { key: "tractNo", label: "Tract No.", type: "text", placeholder: "5991" },
    { key: "bookPage", label: "Book / Page", type: "text", placeholder: "169M / 34-37" },
    { key: "recDate", label: "Recorded Date", type: "date", placeholder: "" },
    { key: "subdivision", label: "Subdivision", type: "text", placeholder: "HARVEST AT LIMONEIRA" },
  ],
  "Tax Cert": [
    { key: "taxYear", label: "Tax Year", type: "text", placeholder: "2025-2026" },
    { key: "apn", label: "APN", type: "text", placeholder: "107-0-330-755" },
    { key: "tra", label: "Tax Rate Area", type: "text", placeholder: "04-028" },
    { key: "inst1", label: "1st Installment", type: "text", placeholder: "$5,410.49" },
    { key: "inst2", label: "2nd Installment", type: "text", placeholder: "$5,410.49" },
    { key: "pmtStatus", label: "Payment Status", type: "select", placeholder: "", options: ["Paid", "1st Open", "Both Open", "Delinquent", "Defaulted"] },
  ],
  Runsheet: [
    { key: "orderNo", label: "Order No.", type: "text", placeholder: "20251823" },
    { key: "searchedBy", label: "Searched By", type: "text", placeholder: "805TITLE INC" },
    { key: "searchDate", label: "Search Date", type: "date", placeholder: "" },
    { key: "geoCov", label: "Geo Coverage", type: "text", placeholder: "JAN 01, 1964 – OCT 03, 2025" },
    { key: "notes", label: "Notes", type: "textarea", placeholder: "Additional search notes" },
  ],
  Starters: [
    { key: "policyNo", label: "Prior Policy No.", type: "text", placeholder: "e.g. 1234-5678" },
    { key: "policyDate", label: "Policy Date", type: "date", placeholder: "" },
    { key: "insured", label: "Insured", type: "text", placeholder: "Prior insured name" },
    { key: "company", label: "Title Company", type: "text", placeholder: "e.g. CHICAGO TITLE" },
    { key: "amount", label: "Policy Amount", type: "text", placeholder: "$000,000" },
  ],
  "Title Chain Review": [
    { key: "recDate", label: "Recorded Date", type: "date", placeholder: "" },
    { key: "docDate", label: "Document Date", type: "date", placeholder: "" },
    { key: "instrNo", label: "Instrument / Book-Page", type: "text", placeholder: "2025-85923" },
    { key: "entityTitle", label: "Entity Title", type: "select", placeholder: "", options: ["", "Transfer", "DOTs", "Liens & Judgments", "Easement & Restrictions", "Miscellaneous"] },
    { key: "docTitle", label: "Doc Title", type: "select", placeholder: "", options: ["", "Grant Deed", "Quitclaim Deed", "Interspousal Deed", "Trustee's Deed", "Sheriff's Deed", "Deed of Trust", "Reconveyance", "Modification of Deed of Trust", "Assignment of Deed of Trust", "Substitution of Trustee", "Mechanic's Lien", "Release of Mechanic's Lien", "Abstract of Judgment", "Release of Judgment", "Federal Tax Lien", "Release of Federal Tax Lien", "State Tax Lien", "Notice of Default", "Notice of Trustee's Sale", "Notice of Completion", "Notice of Cessation", "Easement", "CC&Rs", "Amendment to CC&Rs", "HOA Lien", "Lis Pendens", "Attachment Lien", "UCC Financing Statement", "Lease", "Other"] },
    { key: "grantor", label: "Grantor", type: "text", placeholder: "Transferor / Borrower" },
    { key: "grantee", label: "Grantee", type: "text", placeholder: "Transferee / Lender" },
    { key: "amount", label: "Amount", type: "text", placeholder: "$83,450" },
    { key: "lienPos", label: "Lien Position", type: "select", placeholder: "", options: ["", "1st", "2nd", "3rd", "Other"] },
    { key: "notes", label: "Remarks / PTN", type: "textarea", placeholder: "Additional remarks" },
  ],
};

const ACCENTS: Record<string, string> = {
  "Assessor Page": "#0369a1",
  "Assessor Map": "#0891b2",
  "Tract Map": "#0d9488",
  "Tax Cert": "#65a30d",
  Runsheet: "#7c3aed",
  Starters: "#475569",
  "Title Chain Review": "#8B0000",
};

export const UPLOAD_CATS: UploadCat[] = Object.entries(FIELDS).map(([label, fields]) => ({
  key: label.toLowerCase().replace(/\s+/g, ""),
  label,
  accent: ACCENTS[label] || "#0369a1",
  fields,
}));

  

 