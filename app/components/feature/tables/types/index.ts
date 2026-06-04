export interface Order {
  no: string;
  apn: string;
  addr: string;
  owner: string;
  county: string;
  fileNo: string;
  productType: string;
  status: "Open" | "In Review" | "Closed" | "Cancelled";
  rush?: boolean;
  date: string;
}

export interface RecentFile {
  no: string;
  addr: string;
  owner: string;
  status: string;
}

export interface OrderLock {
  user: string;
  since: string;
}

export interface PropertyData {
  PropertyId?: number;
  SitusAddress?: {
    StreetAddress?: string;
    City?: string;
    State?: string;
    Zip9?: string;
    County?: string;
    APN?: string;
  };
  ParsedStreetAddress?: {
    StandardizedHouseNumber?: number;
    StandardizedHouseNumberString?: string;
    StreetName?: string;
    StreetSuffix?: string;
    DirectionPrefix?: string;
    DirectionSuffix?: string;
    ApartmentOrUnit?: string | null;
  };
  OwnerInformation?: {
    Owner1FullName?: string;
    OwnerVestingInfo?: {
      VestingOwner?: string;
      VestingOwnershipRight?: string;
      VestingEtal?: string;
    };
    Occupancy?: string;
  };
  LocationInformation?: {
    LegalDescription?: string;
    APN?: string;
    TractNumber?: string;
    LegalLot?: string;
    LegalBlock?: string;
    NeighborhoodName?: string;
    SchoolDistrict?: string;
  };
  SiteInformation?: {
    LandUse?: string;
    CountyUse?: string;
    Acres?: number;
    LotArea?: number;
    FloodZoneCode?: string;
    FloodMap?: string;
  };
  PropertyCharacteristics?: {
    GrossArea?: number;
    LivingArea?: number;
    TotalRooms?: number;
    Bedrooms?: number;
    FullBath?: number;
    HalfBath?: number;
    YearBuilt?: string;
    ParkingType?: string;
    GarageCapacity?: number;
    Pool?: string;
    AirConditioning?: string;
  };
  TaxInformation?: {
    TaxYear?: number;
    TotalTaxableValue?: number;
    PropertyTax?: number;
    TaxArea?: string;
    AssessedValue?: number;
    LandValue?: number;
    ImprovementValue?: number;
  };
  OwnerTransferInformation?: {
    DeedType?: string;
    SaleDate?: string;
    SalePrice?: number;
    TransferDocumentNumber?: string;
    BuyerName?: string;
    SellerName?: string;
  };
  LastMarketSaleInformation?: {
    SaleDate?: string;
    SalePrice?: number;
    FirstMortgageAmount?: number;
    FirstMortgageType?: string;
    FirstMortgageInterestRate?: number;
    Lender?: string;
    TitleCompany?: string;
  };
}

export interface PropertyForm {
  addrNo: string;
  dirPrefix: string;
  streetName: string;
  suffix: string;
  postDir: string;
  unitType: string;
  unitNo: string;
  city: string;
  state: string;
  zip: string;
  county: string;
  apn1: string;
  apn2: string;
  apn3: string;
  apn4: string;
  lot: string;
  block: string;
  tract: string;
  mapBook: string;
  page: string;
  section: string;
  township: string;
  range: string;
  shortLegal: string;
  municipality: string;
  jurisdiction: string;
  vestingText: string;
  vestingType: string;
  landUse: string;
  _yearBuilt?: string;
  _livingArea?: string;
  _bedrooms?: string;
  _bathrooms?: number;
  _pool?: string;
  _garage?: string;
  _acreage?: number;
  _lotSqFt?: number;
  _floodZone?: string;
  _taxYear?: number;
  _assessedValue?: string;
  _annualTax?: string;
  _lastSaleDate?: string;
  _lastSalePrice?: string;
  _seller?: string;
  _buyer?: string;
  _deedType?: string;
  _docNo?: string;
  _lender?: string;
  _mtgAmt?: string;
  _mtgRate?: string;
  _neighborhood?: string;
}

export interface Buyer {
  id: number;
  name: string;
  first?: string;
  last?: string;
  mid?: string;
  vesting?: string;
  phone?: string;
  email?: string;
  addr?: string;
  city?: string;
  state?: string;
  zip?: string;
  entity?: string;
  ssn?: string;
}

export interface Seller {
  id: number;
  name: string;
  first?: string;
  last?: string;
  mid?: string;
  vesting?: string;
  phone?: string;
  email?: string;
  addr?: string;
  deedType?: string;
  docNo?: string;
}

export interface IndexRow {
  _id?: string;
  rec: string;
  abbr?: string;
  entity?: string;
  docTitle?: string;
  instr: string;
  book: string;
  pg: string;
  grantor: string;
  grantee: string;
  status?: string;
  parentInstr?: string | null;
  type?: string;
}

export interface ChainCode {
  id: number;
  type: "exception" | "requirement" | "note";
  code: string;
  verbiage: string;
}

export interface SharedState {
  vesting: string;
  legal: string;
  leaseHold: string;
  effectiveDate: string;
  chainCodes: ChainCode[];
}

export interface Document {
  name: string;
  date: string;
  size: string;
  type: "document" | "template";
  body?: string;
}

export interface Note {
  author: string;
  date: string;
  text: string;
}

export interface IndexSection {
  title: string;
  sub: string;
  accent: string;
  rows: IndexRow[];
}

export type SearchType = "APN" | "Address" | "FullAddress" | "OwnerName" | "PropertyId" | "Advanced";

export type CreateOrderStep = -1 | 0 | 1 | 2 | 3;

export interface CreateOrderModalProps {
  onClose: () => void;
  onCreate: (orderData: Record<string, unknown>) => void;
}

export interface CreateTemplateModalProps {
  onClose: () => void;
  onSave: (tpl: { name: string; date: string; size: string; type: "template"; body?: string }) => void;
}

export interface FinalPrelimModalProps {
  onClose: () => void;
  onSave: (tpl: { name: string; date: string; size: string; type: "template"; body?: string }) => void;
}

export interface SendPrelimModalProps {
  onClose: () => void;
  docs: DocItem[];
}

export interface ManualSearchModalProps {
  onClose: () => void;
}

export interface DocItem {
  name: string;
  date: string;
  size: string;
  type?: string;
}

export interface NoteItem {
  author: string;
  date: string;
  text: string;
}

export interface FInpProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  half?: boolean;
  style?: React.CSSProperties;
}

export interface FSelProps {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: (string | { value: string; label: string })[];
  style?: React.CSSProperties;
}

export interface FRowProps {
  children: React.ReactNode;
}

export interface FGridProps {
  cols?: number;
  children: React.ReactNode;
}

export interface ResultBoxProps {
  children: React.ReactNode;
}

export interface SearchDataTraceProps {
  source: string;
}

export interface CardHeadProps {
  title: string;
  sub?: string;
  right?: React.ReactNode;
  accent?: string;
}

export interface LblProps {
  children: React.ReactNode;
}

export interface InpProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}

export interface SelProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: (string | { value: string; label: string })[];
}

export interface BtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export interface PrelimData {
  orderNo: string;
  fileNo: string;
  titleOfficer: string;
  titleEmail: string;
  titlePhone: string;
  titleFax: string;
  propertyAddress: string;
  effectiveDate: string;
  effectiveTime: string;
  county: string;
  city: string;
  vestingName: string;
  vestingType: string;
  leaseHold: string;
  legal: string;
  apn: string;
  exceptions: { code: string; verbiage: string }[];
  requirements: { code: string; verbiage: string }[];
  notes: { code: string; verbiage: string }[];
  easements: string;
  extraNotes: string;
}

export interface PrelimPreviewModalProps {
  data: PrelimData;
  onClose: () => void;
}

export interface IconProps {
  name: string;
  size?: number;
  style?: React.CSSProperties;
  className?: string;
}

export interface FormData {
  search: {
    type: SearchType;
    apnInput: string;
    zipInput: string;
    addrNum: string;
    addrStr: string;
    addrCity: string;
    addrState: string;
    addrZip: string;
    ownerName: string;
    propId: string;
    fullAddr: string;
    advCounty: string;
    advYear: string;
    advBeds: string;
  };
  property: PropertyForm;
  file: {
    clientName: string;
    clientFileNo: string;
    transactionType: string;
    productType: string;
    sourceOfBusiness: string;
    loanNumber: string;
  };
  escrow: {
    escrowNo: string;
    escrowCompany: string;
    titleOffice: string;
    escrowOffice: string;
    branch: string;
    loanOfficer: string;
    lender: string;
  };
  parties: {
    buyers: Buyer[];
    sellers: Seller[];
    bFirst: string;
    bLast: string;
    bMid: string;
    bVest: string;
    bPhone: string;
    bEmail: string;
    bAddr: string;
    bCity: string;
    bState: string;
    bZip: string;
    bEntity: string;
    sFirst: string;
    sLast: string;
    sMid: string;
    sVest: string;
    sPhone: string;
    sEmail: string;
    sAddr: string;
    sDeedType: string;
    sDocNo: string;
  };
}
