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

export const UPLOAD_CATS: UploadCat[] = [
  {
    key: "assessorPage",
    label: "Assessor Page",
    accent: "#0369a1",
    fields: [
      { k: "apn", lbl: "APN", t: "text", ph: "107-0-330-755" },
      { k: "owner", lbl: "Owner Name", t: "text", ph: "RODRIGUEZ RAQUEL" },
      {
        k: "address",
        lbl: "Situs Address",
        t: "text",
        ph: "2012 HARVEST LOOP, SANTA PAULA, CA",
      },
      { k: "assessed", lbl: "Assessed Value", t: "text", ph: "$652,575" },
      { k: "taxYear", lbl: "Tax Year", t: "text", ph: "2025" },
      { k: "landUse", lbl: "Land Use", t: "text", ph: "CONDOMINIUM" },
    ],
  },
  {
    key: "assessorMap",
    label: "Assessor Map",
    accent: "#0891b2",
    fields: [
      { k: "mapRef", lbl: "Map Reference", t: "text", ph: "169MR34" },
      { k: "parcelNo", lbl: "Parcel No.", t: "text", ph: "107-0-330-755" },
      { k: "mapDate", lbl: "Map Date", t: "date", ph: "" },
      {
        k: "notes",
        lbl: "Notes",
        t: "textarea",
        ph: "Map notes or page reference",
      },
    ],
  },
  {
    key: "tractMap",
    label: "Tract Map",
    accent: "#0d9488",
    fields: [
      { k: "tractNo", lbl: "Tract No.", t: "text", ph: "5991" },
      { k: "bookPage", lbl: "Book / Page", t: "text", ph: "169M / 34-37" },
      { k: "recDate", lbl: "Recorded Date", t: "date", ph: "" },
      {
        k: "subdivision",
        lbl: "Subdivision Name",
        t: "text",
        ph: "Harvest Meadows",
      },
    ],
  },
  {
    key: "titleChain",
    label: "Title Chain Review",
    accent: "#0369a1",
    fields: [
      { k: "docType", lbl: "Document Type", t: "text", ph: "Grant Deed" },
      {
        k: "instrumentNo",
        lbl: "Instrument No.",
        t: "text",
        ph: "2024-0012345",
      },
      { k: "recDate", lbl: "Recording Date", t: "date", ph: "" },
      { k: "grantor", lbl: "Grantor", t: "text", ph: "" },
      { k: "grantee", lbl: "Grantee", t: "text", ph: "" },
    ],
  },
  {
    key: "taxCert",
    label: "Tax Cert",
    accent: "#65a30d",
    fields: [
      { k: "taxYear", lbl: "Tax Year", t: "text", ph: "2025" },
      { k: "taxAmount", lbl: "Tax Amount", t: "text", ph: "$10,820.98" },
      { k: "delinquent", lbl: "Delinquent Year", t: "text", ph: "" },
      { k: "paidBy", lbl: "Paid By", t: "text", ph: "" },
    ],
  },
];

