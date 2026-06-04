export interface CreateOrderPayload {
  streetName: string;
  city: string;
  state: string;
  zipCode: string;
  county: string;
  apn1: string;
  clientName: string;
  clientFileNo: string;
  transactionType: string;
  productType: string;
  sourceOfBusiness: string;
  loanAmount: string;
  loanNumber: string;
  buyers: BuyerPayload[];
  sellers: SellerPayload[];
  titleOffice: string;
  escrowOffice: string;
  titleBranchReview: string;
  loanOfficer: string;
  lenderBank: string;
}

export interface BuyerPayload {
  firstName: string;
  lastName: string;
  middleSuffix: string;
  entityType: string;
  vesting: string;
  vestingPercent: string;
  phone: string;
  email: string;
  mailingAddress: string;
  city: string;
  state: string;
  zip: string;
}

export interface SellerPayload {
  firstName: string;
  lastName: string;
  middleSuffix: string;
  currentVesting: string;
  entityType: string;
  deedType: string;
  phone: string;
  email: string;
  mailingAddress: string;
  recordedDocNo: string;
}
