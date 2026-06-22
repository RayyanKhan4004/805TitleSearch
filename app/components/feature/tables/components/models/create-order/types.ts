export interface BuyerPayload {
  firstName: string;
  lastName: string;
  middleSuffix: string;
  entityType: string;
  vesting: string;
  phone: string;
  email: string;
  mailingAddress: string;
  city: string;
  state: string;
  zip: string;
  ssnTaxId: string;
}

export interface SellerPayload {
  firstName: string;
  lastName: string;
  middleSuffix: string;
  currentVesting: string;
  deedType: string;
  phone: string;
  email: string;
  mailingAddress: string;
  recordedDocNo: string;
}

export interface EscrowTitlePayload {
  titleOffice: string;
  titleBranch: string;
  titleOfficer: string;
  titleOfficerEmail: string;
  escrowOffice: string;
  escrowOfficer: string;
  escrowOfficerEmail: string;
  loanOfficer: string;
  lenderBank: string;
}

export interface AgentPayload {
  companyName: string;
  companyDre: string;
  contactName: string;
  contactDre: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  fax: string;
  mobile: string;
  email: string;
  refNo: string;
}

export interface LenderPayload {
  companyName: string;
  companyNmls: string;
  contactName: string;
  contactNmls: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  fax: string;
  mobile: string;
  email: string;
  refNo: string;
}

export interface PrimaryContactPayload {
  companyName: string;
  companyId: string;
  contactName: string;
  contactId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
}

export interface CreateOrderRequest {
  orderNumber?: string;
  addrNo: string;
  dirPrefix: string;
  streetName: string;
  suffix: string;
  postDir: string;
  unitType: string;
  unitNo: string;
  city: string;
  state: string;
  zipCode: string;
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
  assessorVesting: string;
  vestingType: string;
  landUse: string;
  municipality: string;
  jurisdiction: string;
  clientName: string;
  clientFileNo: string;
  transactionType: string;
  productType: string;
  sourceOfBusiness: string;
  loanAmount: string;
  loanNumber: string;
  estimatedClosingDate: string;
  expectedDelivery: string;
  businessSegment: string;
  underwriter: string;
  salePrice: string;
  insuredAmount: string;
  premiumOwners: string;
  premiumLenders: string;
  premiumBinder: string;
  ownersPolicyNo: string;
  loanPolicyNo: string;
  binderPolicyNo: string;
  escrowCoRefNo: string;
  titleOfficer: string;
  titleOfficerEmail: string;
  escrowOfficer: string;
  escrowOfficerEmail: string;
  titleRep: string;
  titleRepEmail: string;
  titleRepPercent: string;
  fileSource: string;
  titleOffice: string;
  escrowOffice: string;
  titleBranchReview: string;
  loanOfficer: string;
  lenderBank: string;
  buyers: BuyerPayload[];
  sellers: SellerPayload[];
  escrowTitles: EscrowTitlePayload[];
  listingAgents: AgentPayload[];
  sellingAgents: AgentPayload[];
  listingSellingAgents: AgentPayload[];
  lenders: LenderPayload[];
  mortgageBrokers: LenderPayload[];
  primaryContacts: PrimaryContactPayload[];
  clients: PrimaryContactPayload[];
}
