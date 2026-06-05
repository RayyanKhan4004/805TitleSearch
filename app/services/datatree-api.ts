import type { PropertyData, PropertyForm, SearchType, IndexRow, AssessorData } from "@/app/components/feature/tables/types";

const MOCK_RESPONSES: Record<string, PropertyData> = {
  "808-631-06": {
    PropertyId: 15428964,
    SitusAddress: {
      StreetAddress: "27901 ENCANTO",
      City: "MISSION VIEJO",
      State: "CA",
      Zip9: "92692-2610",
      County: "ORANGE",
      APN: "808-631-06",
    },
    ParsedStreetAddress: {
      StandardizedHouseNumber: 27901,
      StandardizedHouseNumberString: "27901",
      StreetName: "ENCANTO",
      StreetSuffix: "",
      DirectionPrefix: "",
      DirectionSuffix: "",
      ApartmentOrUnit: null,
    },
    OwnerInformation: {
      Owner1FullName:
        "SARMIENTO REYNALDO C JR TR SARMIENTO WILAISONO FAMILY REVO",
      OwnerVestingInfo: {
        VestingOwner: "",
        VestingOwnershipRight: "",
        VestingEtal: "",
      },
      Occupancy: "Owner Occupied",
    },
    LocationInformation: {
      LegalDescription: "N TR 9514 BLK LOT 6",
      APN: "808-631-06",
      TractNumber: "9514",
      LegalLot: "6",
      LegalBlock: "",
      NeighborhoodName: "CASTILLE CENTRAL",
      SchoolDistrict: "CAPISTRANO UNIFIED SCHOOL DISTRICT",
    },
    SiteInformation: {
      LandUse: "SFR",
      CountyUse: "RESIDENTIAL",
      Acres: 0.1521,
      LotArea: 6624,
      FloodZoneCode: "X",
      FloodMap: "06059C0432J",
    },
    PropertyCharacteristics: {
      GrossArea: 2774,
      LivingArea: 2774,
      TotalRooms: 8,
      Bedrooms: 5,
      FullBath: 3,
      HalfBath: 0,
      YearBuilt: "1979",
      ParkingType: "GARAGE",
      GarageCapacity: 2,
      Pool: "Yes",
      AirConditioning: "CENTRAL",
    },
    TaxInformation: {
      TaxYear: 2024,
      TotalTaxableValue: 1016402,
      PropertyTax: 10099.72,
      TaxArea: "27-006",
      AssessedValue: 1016402,
      LandValue: 788345,
      ImprovementValue: 228057,
    },
    OwnerTransferInformation: {
      DeedType: "GRANT DEED",
      SaleDate: "2021-01-22T00:00:00",
      SalePrice: 939000,
      TransferDocumentNumber: "70877",
      BuyerName: "SARMIENTO REYNALDO C / WILAISONO NOVRIYANTI",
      SellerName: "WALKER SUSAN DIANE",
    },
    LastMarketSaleInformation: {
      SaleDate: "2021-01-22T00:00:00",
      SalePrice: 939000,
      FirstMortgageAmount: 704250,
      FirstMortgageType: "CONVENTIONAL",
      FirstMortgageInterestRate: 2.67,
      Lender: "PARKSIDE LENDING LLC",
      TitleCompany: "TICOR TTL ORANGE CNTY BRANCH",
    },
  },
};

export function mapApiToForm(data: PropertyData): PropertyForm {
  const p = data.ParsedStreetAddress || {};
  const s = data.SitusAddress || {};
  const o = data.OwnerInformation || {};
  const l = data.LocationInformation || {};
  const si = data.SiteInformation || {};
  const pc = data.PropertyCharacteristics || {};
  const ti = data.TaxInformation || {};
  const ot = data.OwnerTransferInformation || {};
  const lm = data.LastMarketSaleInformation || {};

  const landUseMap: Record<string, string> = {
    SFR: "Single Family Residential",
    MFR: "Multi-Family Residential",
    CONDO: "Condominium",
    PUD: "Planned Unit Development",
    COMM: "Commercial",
    IND: "Industrial",
    VAC: "Vacant Land",
  };
  const lu = landUseMap[si.LandUse || ""] || "Single Family Residential";

  return {
    addrNo: String(p.StandardizedHouseNumber || ""),
    dirPrefix: p.DirectionPrefix || "",
    streetName: p.StreetName || s.StreetAddress || "",
    suffix: p.StreetSuffix || "",
    postDir: p.DirectionSuffix || "",
    unitType: p.ApartmentOrUnit ? "Apt" : "",
    unitNo: p.ApartmentOrUnit || "",
    city: s.City || "",
    state: s.State || "CA",
    zip: (s.Zip9 || "").split("-")[0],
    county: s.County || "",
    apn1: s.APN || l.APN || "",
    apn2: "",
    apn3: "",
    apn4: "",
    lot: l.LegalLot || "",
    block: l.LegalBlock || "",
    tract: l.TractNumber || "",
    mapBook: "",
    page: "",
    section: "",
    township: "",
    range: "",
    shortLegal: l.LegalDescription || "",
    municipality: "City",
    jurisdiction: s.City || "",
    vestingText: o.Owner1FullName || o.OwnerNames || "",
    vestingType:
      String(o.Owner1FullName || o.OwnerNames || "").toUpperCase().includes("TR")
        ? "Trust"
        : "Community Property",
    landUse: lu,
    _yearBuilt: pc.YearBuilt ? String(pc.YearBuilt) : "",
    _livingArea: pc.LivingArea ? String(pc.LivingArea) : "",
    _bedrooms: pc.Bedrooms ? String(pc.Bedrooms) : "",
    _bathrooms: (pc.FullBath || 0) + (pc.HalfBath || 0) * 0.5,
    _pool: pc.Pool || "",
    _garage: pc.GarageCapacity ? `${pc.GarageCapacity} car` : "",
    _acreage: si.Acres || 0,
    _lotSqFt: si.LotArea || 0,
    _floodZone: si.FloodZoneCode || "",
    _taxYear: ti.TaxYear || 0,
    _assessedValue: ti.AssessedValue
      ? `$${Number(ti.AssessedValue).toLocaleString()}`
      : "",
    _annualTax: ti.PropertyTax
      ? `$${Number(ti.PropertyTax).toLocaleString()}`
      : "",
    _lastSaleDate: ot.SaleDate
      ? new Date(ot.SaleDate).toLocaleDateString("en-US")
      : "",
    _lastSalePrice: ot.SalePrice
      ? `$${Number(ot.SalePrice).toLocaleString()}`
      : "",
    _seller: ot.SellerName || "",
    _buyer: ot.BuyerName || "",
    _deedType: ot.DeedType || "",
    _docNo: ot.TransferDocumentNumber || "",
    _lender: lm.Lender || "",
    _mtgAmt: lm.FirstMortgageAmount
      ? `$${Number(lm.FirstMortgageAmount).toLocaleString()}`
      : "",
    _mtgRate: lm.FirstMortgageInterestRate
      ? `${lm.FirstMortgageInterestRate}%`
      : "",
    _neighborhood: l.NeighborhoodName || "",
  };
}

interface SearchParams {
  ApnDetail?: { APN: string; ZipCode: string };
  AddressDetail?: {
    HouseNumber: string;
    StreetName: string;
    City: string;
    State: string;
    Zip: string;
  };
  FullAddressDetail?: { FullAddress: string };
  OwnerNameDetail?: { OwnerName: string; State: string };
  PropertyIdDetail?: { PropertyId: string };
  AdvancedDetail?: { County: string; YearBuilt: string; Bedrooms: string; State: string };
}

/**
 * Search property via DataTree API
 * Replace mock implementation with real API call:
 *
 * const res = await fetch("https://dtapiuat.datatree.com/api/Report/GetReport", {
 *   method: "POST",
 *   headers: {
 *     "Content-Type": "application/json",
 *     "Accept": "application/json",
 *     "Authorization": `Bearer ${token}`,
 *   },
 *   body: JSON.stringify({
 *     ProductNames: ["PropertyDetailReport"],
 *     SearchType: searchType,
 *     ...params,
 *   }),
 * });
 * const json = await res.json();
 * return json.Reports?.[0]?.Data?.SubjectProperty || null;
 */
export async function searchProperty(
  searchType: SearchType,
  params: SearchParams,
): Promise<PropertyData | null> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 900));

  const apn = params.ApnDetail?.APN || "";
  const cleanApn = apn.replace(/[^0-9\-]/g, "");
  const found = MOCK_RESPONSES["808-631-06"];

  if (
    searchType === "APN" &&
    (apn.includes("808-631-06") || apn.includes("80863106"))
  )
    return found;
  if (
    searchType === "Address" &&
    (params.AddressDetail?.StreetName || "")
      .toUpperCase()
      .includes("ENCANTO")
  )
    return found;
  if (
    searchType === "OwnerName" &&
    (params.OwnerNameDetail?.OwnerName || "")
      .toUpperCase()
      .includes("SARMIENTO")
  )
    return found;
  if (
    searchType === "PropertyId" &&
    String(params.PropertyIdDetail?.PropertyId) === "15428964"
  )
    return found;

  // Demo: for any APN search return sample data so devs can see the flow
  if (searchType === "APN" && apn.length > 5) return found;
  if (searchType === "Address" && params.AddressDetail?.StreetName) return found;
  if (searchType === "OwnerName" && params.OwnerNameDetail?.OwnerName) return found;
  if (searchType === "FullAddress" && params.FullAddressDetail?.FullAddress) return found;
  if (searchType === "PropertyId" && params.PropertyIdDetail?.PropertyId) return found;

  return null;
}

export function mapApiChainToIndexRows(chain: unknown): IndexRow[] {
  if (!Array.isArray(chain)) return [];
  return chain.map((item: Record<string, any>, i) => ({
    _id: `chain-${i}`,
    rec: item.RecordingDate || item.recordingDate || item.Date || item.date || "",
    abbr: item.DocumentType || item.documentType || item.abbr || "",
    entity: item.Entity || item.entity || "",
    docTitle: item.DocTitle || item.docTitle || item.Title || item.title || "",
    instr: item.InstrumentNumber || item.instrumentNumber || item.Instr || item.instr || "",
    book: item.Book || item.book || "",
    pg: item.Page || item.page || "",
    grantor: item.Grantor || item.grantor || "",
    grantee: item.Grantee || item.grantee || "",
    status: item.Status || item.status || "",
    parentInstr: item.ParentInstr || item.parentInstr || null,
    type: item.Type || item.type || "",
  }));
}

function extractNum(v: unknown): number {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  const n = parseFloat(String(v).replace(/[^0-9.-]/g, ""));
  return isNaN(n) ? 0 : n;
}

export function mapRawToAssessorData(raw: Record<string, any>): AssessorData {
  const now = () => new Date().toLocaleDateString("en-US");
  const o = raw.OwnerInformation || {};
  const l = raw.LocationInformation || {};
  const si = raw.SiteInformation || {};
  const pc = raw.PropertyCharacteristics || {};
  const ti = raw.TaxInformation || {};
  const subject = raw.SubjectProperty || {};
  const situs = subject.SitusAddress || {};
  const parsed = subject.ParsedStreetAddress || {};

  const street = [
    parsed.StandardizedHouseNumber || parsed.StandardizedHouseNumberString || "",
    parsed.DirectionPrefix || "",
    parsed.StreetName || situs.StreetAddress || "",
    parsed.StreetSuffix || "",
  ].filter(Boolean).join(" ");

  return {
    reportDate: now(),
    countyDataAsOf: now(),
    streetAddress: street,
    city: situs.City || "",
    state: situs.State || "CA",
    zip: (situs.Zip9 || "").split("-")[0],
    apn: situs.APN || l.APN || "",
    county: situs.County || "",
    ownerName: o.Owner1FullName || o.OwnerNames || "",
    owner1: o.Owner1FullName || o.OwnerNames || "",
    owner2: o.Owner2FullName || o.OwnerVestingInfo?.VestingOwner || "",
    vesting: o.OwnerVestingInfo?.VestingOwnershipRight || "",
    occupancy: o.Occupancy || "",
    mailingAddress: (() => {
      const ma = o.MailingAddress;
      if (!ma || typeof ma !== "object") return ma || "";
      return [ma.StreetAddress, ma.City, ma.State, ma.Zip9].filter(Boolean).join(", ");
    })(),
    legalDescription: l.LegalDescription || "",
    munic: l.Munic || "",
    tractNumber: l.TractNumber || "",
    legalLot: l.LegalLot || "",
    legalBlock: l.LegalBlock || "",
    mapRef: l.MapReference || "",
    characteristics: {
      livingArea: extractNum(pc.LivingArea),
      bedrooms: extractNum(pc.Bedrooms),
      fullBath: extractNum(pc.FullBath),
      halfBath: extractNum(pc.HalfBath),
      yearBuilt: pc.YearBuilt || "",
      stories: extractNum(pc.Stories ?? pc.TotalStories),
      parkingType: pc.ParkingType || "",
      garageArea: extractNum(pc.GarageCapacity),
      pool: pc.Pool || "",
    },
    site: {
      landUse: si.LandUse || "",
      countyUse: si.CountyUse || "",
      acres: si.Acres ?? null,
      lotArea: si.LotArea ?? null,
      floodZoneCode: si.FloodZoneCode || "",
      floodMap: si.FloodMap || "",
    },
    tax: {
      assessedYear: ti.TaxYear || 0,
      taxYear: ti.TaxYear || 0,
      taxArea: ti.TaxArea || "",
      propertyTax: extractNum(ti.PropertyTax),
      assessedValue: extractNum(ti.AssessedValue),
      landValue: extractNum(ti.LandValue),
      improvementValue: extractNum(ti.ImprovementValue),
    },
  };
}
