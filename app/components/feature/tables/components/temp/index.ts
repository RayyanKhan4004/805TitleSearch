import type {
  Order,
  RecentFile,
  IndexRow,
  DocItem,
  NoteItem,
  SharedState,
  AssessorData,
} from "@/app/components/feature/tables/types";

export interface CatxCode {
  code: string;
  label: string;
  verbiage: string;
}

export const ORDERS: Order[] = [
  {
    no: "26050012",
    apn: "123-456-78",
    addr: "123 Main St",
    owner: "Michael Smith",
    county: "Los Angeles",
    fileNo: "ESC-2026-4412",
    productType: "CLTA Owner",
    status: "Open",
    rush: true,
    date: "06/02/2026",
  },
  {
    no: "26050018",
    apn: "458-888-12",
    addr: "458 Oak Ave",
    owner: "John Doe",
    county: "Riverside",
    fileNo: "ESC-2026-3391",
    productType: "ALTA Lender",
    status: "Closed",
    date: "05/28/2026",
  },
  {
    no: "26050019",
    apn: "789-444-98",
    addr: "88 Sunset Blvd",
    owner: "James Parker",
    county: "San Diego",
    fileNo: "ESC-2026-2204",
    productType: "CLTA Owner",
    status: "Cancelled",
    date: "05/15/2026",
  },
  {
    no: "26050023",
    apn: "321-111-55",
    addr: "44 Palm Drive",
    owner: "Sara Lee",
    county: "Orange",
    fileNo: "ESC-2026-5519",
    productType: "ALTA Homeowners",
    status: "Open",
    rush: true,
    date: "06/04/2026",
  },
  {
    no: "26050027",
    apn: "654-222-33",
    addr: "99 Harbor Blvd",
    owner: "Tom Brown",
    county: "Ventura",
    fileNo: "ESC-2026-6630",
    productType: "CLTA/ALTA",
    status: "Open",
    date: "06/01/2026",
  },
  {
    no: "26050031",
    apn: "987-333-77",
    addr: "55 Willow Lane",
    owner: "Amy Chang",
    county: "San Bernardino",
    fileNo: "ESC-2026-7741",
    productType: "ALTA Lender",
    status: "Open",
    date: "05/30/2026",
  },
];

export const RECENT_FILES: RecentFile[] = [
  {
    no: "#26050012",
    addr: "123 Main Street, Los Angeles",
    owner: "Michael Smith",
    status: "Open",
  },
  {
    no: "#26050018",
    addr: "458 Oak Ave, Riverside",
    owner: "John Doe",
    status: "Closed",
  },
  {
    no: "#26050019",
    addr: "88 Sunset Blvd, San Diego",
    owner: "James Parker",
    status: "Cancelled",
  },
];

// export const TC_ROWS: IndexRow[] = [
//   { rec: "06/12/2019", abbr: "QCD", entity: "XFER", docTitle: "Quitclaim Deed", instr: "2019-0098234", book: "", pg: "", grantor: "ESTATE OF HELEN SMITH", grantee: "MICHAEL SMITH" },
//   { rec: "05/17/2025", abbr: "GD", entity: "XFER", docTitle: "Grant Deed", instr: "2023-0212342", book: "", pg: "", grantor: "MICHAEL SMITH", grantee: "JOHN D DOE" },
//   { rec: "03/22/2020", abbr: "DOT", entity: "DOT", docTitle: "Deed of Trust", instr: "2020-0044512", book: "", pg: "", grantor: "MICHAEL SMITH", grantee: "WELLS FARGO BANK" },
//   { rec: "11/05/2022", abbr: "RECON", entity: "DOT", docTitle: "Reconveyance", instr: "2022-0189001", book: "", pg: "", grantor: "WELLS FARGO BANK", grantee: "MICHAEL SMITH", parentInstr: "2020-0044512" },
//   { rec: "04/17/2023", abbr: "DOT", entity: "DOT", docTitle: "Deed of Trust", instr: "2025-0213146", book: "", pg: "", grantor: "JOHN D DOE", grantee: "BANK OF AMERICA" },
//   { rec: "09/14/2021", abbr: "MECH", entity: "LIEN", docTitle: "Mechanic's Lien", instr: "2021-0077893", book: "", pg: "", grantor: "ACME CONTRACTORS", grantee: "MICHAEL SMITH" },
//   { rec: "01/30/2024", abbr: "JUDG", entity: "LIEN", docTitle: "Judgment Lien", instr: "2024-0031122", book: "", pg: "", grantor: "COUNTY OF LOS ANGELES", grantee: "JOHN D DOE" },
//   { rec: "08/03/2022", abbr: "NOC", entity: "MISC", docTitle: "Notice of Completion", instr: "2022-0143900", book: "", pg: "", grantor: "MICHAEL SMITH", grantee: "\u2014" },
//   { rec: "04/11/1998", abbr: "EASE", entity: "EASE", docTitle: "Easement", instr: "1998-0022341", book: "", pg: "", grantor: "CITY OF GLENDALE", grantee: "PUBLIC" },
//   { rec: "07/19/2005", abbr: "CCR", entity: "EASE", docTitle: "CC&Rs", instr: "2005-0188770", book: "", pg: "", grantor: "SUNSET HILLS HOA", grantee: "ALL OWNERS" },
// ];

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

export const INIT_DOCS = [
  {
    name: "Prefon_Papers.pdf",
    date: "05/07/2026",
    size: "1.2 MB",
    type: "document" as const,
  },
  {
    name: "Deed_2022-001234.pdf",
    date: "05/07/2024",
    size: "834 KB",
    type: "document" as const,
  },
  {
    name: "Tax_GH_3025.pdf",
    date: "05/04/2026",
    size: "412 KB",
    type: "document" as const,
  },
  {
    name: "HDA_Statement.pdf",
    date: "05/01/2026",
    size: "2.1 MB",
    type: "document" as const,
  },
  {
    name: "Prelim_Notax.pdf",
    date: "05/01/2026",
    size: "567 KB",
    type: "document",
  },
];

export const INIT_NOTES = [
  {
    author: "John Smith",
    date: "08/07/2026 10:15 AM",
    text: "Full open liens and county vesting, HDA data pending.",
  },
  {
    author: "Mary Johnsen",
    date: "05/07/2026 09:02 AM",
    text: "Requested payoff for 1st TB from Title Source.",
  },
  {
    author: "John Smith",
    date: "05/07/2020 03:45 PM",
    text: "Order received, Preliminary report generated.",
  },
];

export const PRELIM_REPORT_BODY = `PRELIMINARY REPORT

Order No.: 2026-000123                          Date: 05/07/2026
Escrow No.: ESC-2026-4412                       Officer: John Smith
Property: 12345 Main Street, Apt 2, Rialto, CA 92376

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
SCHEDULE A
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

1. Effective Date: May 07, 2026 at 7:30 a.m.

2. Policy or Policies to be issued:
   CLTA Standard Coverage Policy \u2013 Owner's
   Amount of Insurance: $485,000.00

   ALTA Lender's Policy
   Amount of Insurance: (Loan Amount TBD)

3. The estate or interest in the land described herein is a FEE.

4. Title to said estate or interest at the date hereof is vested in:
   JOHN D. DOE AND JANE R. DOE, Husband and Wife as
   Community Property

5. The land referred to in this Report is described as follows:
   LOT 22 OF TRACT 12345, IN THE CITY OF RIALTO, COUNTY OF
   SAN BERNARDINO, STATE OF CALIFORNIA, AS PER MAP RECORDED
   IN BOOK 123, PAGE 45 OF MAPS, IN THE OFFICE OF THE COUNTY
   RECORDER OF SAID COUNTY.

   APN: 0557-081-23-0000

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
SCHEDULE B \u2013 REQUIREMENTS
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

1. Payment of the full consideration to or for the account of the
   grantors or mortgagors, as applicable.

2. Instruments in recordable form which must be executed, delivered
   and duly filed for record.

3. A Grant Deed from MICHAEL SMITH to JOHN D. DOE AND JANE R. DOE
   conveying the land described in Schedule A.

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
SCHEDULE B \u2013 EXCEPTIONS
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

1. Property taxes, including any personal property taxes and any
   assessments collected with taxes, for the fiscal year 2025-2026.
   1st Installment: $1,842.50 \u2014 PAID
   2nd Installment: $1,842.50 \u2014 PAID
   APN: 0557-081-23-0000

2. Any liens or other assessments, bonds or special district levies
   of San Bernardino County.

3. An easement for utilities and incidental purposes in favor of
   CITY OF GLENDALE, recorded April 11, 1998 as Instrument No.
   1998-0022341.

4. Covenants, Conditions and Restrictions (CC&Rs) of SUNSET HILLS
   HOMEOWNERS ASSOCIATION, recorded July 19, 2005 as Instrument No.
   2005-0188770.

5. A Deed of Trust to secure an indebtedness for the original amount
   of (TBD), dated April 17, 2023, executed by JOHN D. DOE and
   JANE R. DOE, as Trustor, in favor of BANK OF AMERICA, N.A.,
   recorded as Instrument No. 2025-0213146.

   NOTE: The above Deed of Trust must be paid off and reconveyed
   prior to or concurrently with the close of escrow.

6. A Judgment Lien in favor of COUNTY OF LOS ANGELES, recorded
   January 30, 2024 as Instrument No. 2024-0031122.
   OUTSTANDING \u2014 Must be resolved prior to close.

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
NOTES
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

A. According to the public records, there have been no deeds
   conveying the property described in this report within a period
   of twenty-four (24) months prior to the date of this report,
   EXCEPT as shown herein.

B. The following matters will not appear as exceptions in the
   policy(ies) to be issued and are not covered by this report:
   Rights of parties in possession.

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
Authorized Signatory: _________________________
805 Title Search
123 Title Street, Suite 100
San Bernardino, CA 92401
License No. TBD
`;

export const ALTA_COMMITMENT_BODY = `ALTA COMMITMENT FOR TITLE INSURANCE

Order No.: 2026-000123                          Date: 05/07/2026
Property: 12345 Main Street, Apt 2, Rialto, CA 92376
Commitment No.: ALTA-2026-000123

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
SCHEDULE A
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

Commitment Date: May 07, 2026

Policy to be Issued: ALTA Extended Coverage
Proposed Insured: JOHN D. DOE AND JANE R. DOE
Proposed Policy Amount: $485,000.00

The estate or interest in the Land described or referred to in this
Commitment is FEE SIMPLE.

Title to the FEE SIMPLE estate or interest in the Land is at the
Commitment Date vested in:
   MICHAEL SMITH, an unmarried man

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
SCHEDULE B-I \u2014 REQUIREMENTS
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

1. Pay the agreed amounts for the interest in the land.
2. Pay us the premiums, fees, and charges for the policy.
3. Documents satisfactory to us creating the interest in the land
   must be signed, delivered, and recorded.
4. Record a Grant Deed from MICHAEL SMITH to JOHN D. DOE AND
   JANE R. DOE.

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
SCHEDULE B-II \u2014 EXCEPTIONS
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

[Exceptions same as Preliminary Report Schedule B]

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
Authorized Signatory: _________________________
`;

export const CLTA_COMMITMENT_BODY = `CLTA STANDARD COVERAGE COMMITMENT

Order No.: 2026-000123                          Date: 05/07/2026
Property: 12345 Main Street, Apt 2, Rialto, CA 92376

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
SCHEDULE A \u2014 OWNER'S COVERAGE
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

Policy Type: CLTA Standard Coverage
Proposed Insured: JOHN D. DOE AND JANE R. DOE
Policy Amount: $485,000.00
Effective Date: May 07, 2026

Vesting: Community Property
APN: 0557-081-23-0000

[Standard CLTA exceptions apply per Schedule B]

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
Authorized Signatory: _________________________
`;

export const FINAL_POLICY_BODY = `FINAL TITLE INSURANCE POLICY

Policy No.: FP-2026-000123                      Issue Date: TBD
Order No.: 2026-000123
Insured: JOHN D. DOE AND JANE R. DOE
Property: 12345 Main Street, Apt 2, Rialto, CA 92376
Policy Amount: $485,000.00

This policy insures against loss or damage, not exceeding the
Amount of Insurance, sustained or incurred by the Insured by
reason of any defect in or lien or encumbrance on the Title...

[To be completed at close of escrow]

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
Authorized Signatory: _________________________
`;

export const EXAMPLE_TEMPLATES = [
  {
    id: "prelim",
    name: "Preliminary Report",
    desc: "Standard CA preliminary title report with Schedule A, B Requirements and Exceptions",
    icon: "fileCheck",
    color: "#8B0000",
    badge: "Most Used",
    body: PRELIM_REPORT_BODY,
  },
  {
    id: "alta",
    name: "ALTA Commitment",
    desc: "ALTA extended coverage commitment for lender and owner policies",
    icon: "shield",
    color: "#0369a1",
    badge: "Lender",
    body: ALTA_COMMITMENT_BODY,
  },
  {
    id: "clta",
    name: "CLTA Commitment",
    desc: "CLTA standard coverage owner's commitment for California residential transactions",
    icon: "file",
    color: "#7c3aed",
    badge: "Owner",
    body: CLTA_COMMITMENT_BODY,
  },
  {
    id: "final",
    name: "Final Policy",
    desc: "Final title insurance policy issued at close of escrow",
    icon: "checkCircle",
    color: "#059669",
    badge: "Close",
    body: FINAL_POLICY_BODY,
  },
];

export const RECIPIENTS = [
  { value: "title_officer", label: "Title Officer" },
  { value: "client", label: "Client" },
  { value: "escrow_officer", label: "Escrow Officer" },
  { value: "lender", label: "Lender" },
  { value: "custom", label: "Custom Recipient" },
];

export const CATX_CODES: CatxCode[] = [
  {
    code: "CATX 1",
    label: "Taxes \u2014 Lien Not Yet Due",
    verbiage:
      "Property taxes, which are a lien not yet due and payable, including any assessments collected with taxes, to be levied for the fiscal year * \u2013 * which are a lien not yet payable.",
  },
  {
    code: "CATX 2",
    label: "General & Special Taxes (Unpaid)",
    verbiage:
      "General and Special City and/or County taxes, including any personal property taxes and any assessments collected with taxes, for the fiscal year * - *:\n1st Installment: $ *   Open Penalty: $ * (if unpaid by December 10)\n2nd Installment: $ *   Open Penalty: $ * (if unpaid by April 10)\nLand Value: $ *   Improvement Value: $ *   APN: *",
  },
  {
    code: "CATX 4",
    label: "Taxes Paid \u2014 Proration Detail",
    verbiage:
      "Property taxes for the fiscal year shown below are paid. For proration purposes the amounts are:\nFiscal year: *   APN: *\n1st Installment: *   2nd Installment: *\nExemption: *   Land: *   Improvements: *\nPersonal Property: *   Code Area: *   Assessment No: *",
  },
  {
    code: "CATX 5",
    label: "Supplemental Taxes",
    verbiage:
      "The lien of supplemental taxes, if any, assessed pursuant to the provisions of Chapter 3.5 (Commencing with Section 75) of the Revenue and Taxation Code of the State of California.",
  },
  {
    code: "CATX 6",
    label: "Improvement District Assessment",
    verbiage:
      "An assessment by the improvement district shown below:\nBond/Act No: *   Series/District: *   For: *\nSaid assessment is collected with the county/city property taxes.",
  },
  {
    code: "CATX 22",
    label: "Supplemental / Escaped Assessments",
    verbiage:
      "The lien of supplemental or escaped assessments of property taxes, if any, made pursuant to the provisions of Chapter 3.5 (commencing with Section 75) or Part 2, Chapter 3, Articles 3 and 4, respectively, of the Revenue and Taxation code of the State of California as a result of the transfer of title to the vestee named in Schedule A; or as a result of changes in ownership or new construction occurring prior to date of policy.",
  },
  {
    code: "CATX 30",
    label: "Tax Defaulted Property",
    verbiage:
      "Said property has been declared tax defaulted for non-payment of delinquent taxes for the fiscal year 20 * - 20 *.\nAmount to redeem for the above stated fiscal year (and subsequent years, if any):\nAmount: $*   Prior to: *\nAmount: $*   Prior to: *\nAssessors Parcel No.: *",
  },
  {
    code: "CATX 31",
    label: "Taxes Not Shown as Existing Liens",
    verbiage:
      "Taxes or assessments which are not shown as existing liens by the records of any taxing authority that levies taxes or assessments on real property or by the Public Records. Proceedings by a public agency which may result in taxes or assessments, or notices of such proceedings, whether or not shown by the records of such agency or by the Public Records.",
  },
];

export const PREFILLS: Record<string, { name: string; email: string }> = {
  title_officer: { name: "John Smith", email: "jsmith@yourtitle.com" },
  client: { name: "John D. Doe", email: "johndoe@email.com" },
  escrow_officer: { name: "Mary Johnson", email: "mjohnson@escrow.com" },
  lender: { name: "Bank of America", email: "closings@bankofamerica.com" },
  custom: { name: "", email: "" },
};

export const BOIL1 =
  "In response to the above referenced application for a policy of title insurance, this company hereby reports that it is prepared to issue, or cause to be issued, as of the date hereof, a policy or policies of title insurance describing the land and the estate or interest therein hereinafter set forth, insuring against loss which may be sustained by reason of any defect, lien or encumbrance not shown or referred to as an exception below or not excluded from coverage pursuant to the printed Schedules, Conditions and Stipulations of said policy forms.";

export const BOIL2 =
  "The printed Exceptions and Exclusions from the coverage and Limitations on Covered Risks of said policy or policies are set forth in Exhibit A attached. The policy to be issued may contain an arbitration clause. When the Amount of Insurance is less than that set forth in the arbitration clause, all arbitrable matters shall be arbitrated at the option of either the Company or the Insured as the exclusive remedy of the parties. Limitations on Covered Risks applicable to the CLTA and ALTA Homeowner\u2019s Policies of Title Insurance which establish a Deductible Amount and a Maximum Dollar Limit of Liability for certain coverages are also set forth in Exhibit A. Copies of the policy forms should be read. They are available from the office which issued this report.";

export const DEFAULT_SHARED_STATE: SharedState = {
  vesting:
    "John D. Doe and Jane R. Doe, husband and wife as community property, COUNTY OF SAN BERNARDINO, STATE OF CALIFORNIA.",
  legal:
    "LOT 22 OF TRACT 12345, IN THE CITY OF RIALTO, COUNTY OF SAN BERNARDINO, STATE OF CALIFORNIA, AS PER MAP RECORDED IN BOOK 123, PAGE 45 OF MAPS, IN THE OFFICE OF THE COUNTY RECORDER OF SAID COUNTY.",
  leaseHold:
    "Fee simple estate subject to leasehold interest as disclosed in supporting documents.",
  effectiveDate: "05/07/2026",
  chainCodes: [
    {
      id: 1,
      type: "exception" as const,
      code: "Exception 1",
      verbiage:
        "Property taxes, including any personal property taxes and any assessments collected with taxes, for the fiscal year 2025-2026, a lien not yet due and payable. APN: 0557-081-23-0000",
    },
    {
      id: 2,
      type: "exception" as const,
      code: "Exception 2",
      verbiage:
        "An easement for public utilities and incidental purposes in favor of CITY OF GLENDALE, recorded April 11, 1998 as Instrument No. 1998-0022341.",
    },
    {
      id: 3,
      type: "exception" as const,
      code: "Exception 3",
      verbiage:
        "Covenants, Conditions and Restrictions of SUNSET HILLS HOA, recorded July 19, 2005 as Instrument No. 2005-0188770.",
    },
    {
      id: 4,
      type: "exception" as const,
      code: "Exception 4",
      verbiage:
        "A Deed of Trust to secure an indebtedness executed by JOHN D. DOE, Trustor, in favor of BANK OF AMERICA, N.A., recorded as Instrument No. 2025-0213146. Must be paid off prior to close.",
    },
    {
      id: 5,
      type: "exception" as const,
      code: "Exception 5",
      verbiage:
        "A Judgment Lien in favor of COUNTY OF LOS ANGELES, recorded January 30, 2024 as Instrument No. 2024-0031122. Must be resolved prior to close.",
    },
    {
      id: 6,
      type: "requirement" as const,
      code: "Requirement 1",
      verbiage:
        "A Grant Deed from MICHAEL SMITH to JOHN D. DOE AND JANE R. DOE conveying the subject property must be executed, delivered, and duly recorded.",
    },
    {
      id: 7,
      type: "requirement" as const,
      code: "Requirement 2",
      verbiage:
        "Payment of all outstanding property taxes and assessments through the date of closing.",
    },
    {
      id: 8,
      type: "note" as const,
      code: "Note A",
      verbiage:
        "According to the public records, there have been no deeds conveying the property within a period of twenty-four (24) months prior to the date of this report, EXCEPT as shown herein.",
    },
  ],
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

export const ASSESSOR_DATA_SAMPLE: AssessorData = {
  reportDate: "06/02/2026",
  countyDataAsOf: "05/26/2026",
  streetAddress: "2012 HARVEST LOOP",
  city: "SANTA PAULA",
  state: "CA",
  zip: "93060-8008",
  apn: "107-0-330-755",
  county: "VENTURA",
  ownerName: "RODRIGUEZ ANGEL DE JESUS M / RODRIGUEZ RAQUEL",
  owner1: "RODRIGUEZ ANGEL DE JESUS M",
  owner2: "RODRIGUEZ RAQUEL",
  vesting: "",
  occupancy: "Absentee Owner",
  mailingAddress: "2012 HARVEST LOOP #23, SANTA PAULA, CA 93060-8008",
  legalDescription: "TRACT: 599100 LOT: 1 REF: 169MR34 CONDO PLAN: 23",
  munic: "SANTA PAULA",
  tractNumber: "599100",
  legalLot: "1",
  legalBlock: "330",
  mapRef: "169MR34",
  characteristics: {
    livingArea: 1939,
    bedrooms: 4,
    fullBath: 3,
    halfBath: 1,
    yearBuilt: "2021",
    stories: 2,
    parkingType: "GARAGE",
    garageArea: 458,
    pool: "",
  },
  site: {
    landUse: "CONDOMINIUM",
    countyUse: "CONDOMINIUM",
    acres: null,
    lotArea: null,
    floodZoneCode: "X",
    floodMap: "06111C0781F",
  },
  tax: {
    assessedYear: 2025,
    taxYear: 2025,
    taxArea: "04-028",
    propertyTax: 10820.98,
    assessedValue: 652575,
    landValue: 423953,
    improvementValue: 228622,
  },
};
