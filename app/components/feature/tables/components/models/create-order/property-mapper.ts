import type { PropertyForm, PropertyData } from "@/app/components/feature/tables/types"
import type { ReportResponse } from "@/app/store/api/propertyReportApi"

export function mapReportToForm(form: Record<string, any>): PropertyForm {
  return {
    addrNo: form.addrNo ?? "",
    dirPrefix: form.dirPrefix ?? "",
    streetName: form.streetName ?? "",
    suffix: form.suffix ?? "",
    postDir: form.postDir ?? "",
    unitType: form.unitType ?? "",
    unitNo: form.unitNo ?? "",
    city: form.city ?? "",
    state: form.state ?? "CA",
    zip: form.zip ?? "",
    county: form.county ?? "",
    apn1: form.apn ?? "",
    apn2: "",
    apn3: "",
    apn4: "",
    lot: form.lot ?? "",
    block: form.block ?? "",
    tract: form.tract ?? "",
    mapBook: "",
    page: "",
    section: "",
    township: "",
    range: "",
    shortLegal: form.shortLegal ?? "",
    municipality: "City",
    jurisdiction: form.city ?? "",
    vestingText: form.vestingText ?? "",
    vestingType: form.vestingType ?? "Community Property",
    landUse: form.landUse ?? "",
    _yearBuilt: form.yearBuilt ? String(form.yearBuilt) : "",
    _livingArea: form.livingArea ? String(form.livingArea) : "",
    _bedrooms: form.bedrooms ? String(form.bedrooms) : "",
    _bathrooms: form.bathrooms ?? 0,
    _pool: form.pool ?? "",
    _garage: form.garage ?? "",
    _acreage: form.acres ? Number(form.acres) : 0,
    _lotSqFt: form.lotSqFt ? Number(form.lotSqFt) : 0,
    _floodZone: form.floodZone ?? "",
    _taxYear: form.taxYear ? Number(form.taxYear) : 0,
    _assessedValue: form.assessedValue ?? "",
    _annualTax: form.annualTax ?? "",
    _lastSaleDate: form.lastSaleDate ?? "",
    _lastSalePrice: form.lastSalePrice ?? "",
    _seller: form.sellerName ?? "",
    _buyer: form.buyerName ?? "",
    _deedType: form.deedType ?? "",
    _docNo: form.docNo ?? "",
    _lender: form.lender ?? "",
    _mtgAmt: form.mtgAmount ?? "",
    _mtgRate: form.mtgRate ?? "",
    _neighborhood: form.neighbourhood ?? "",
  }
}

export function buildApiResult(res: ReportResponse): PropertyData {
  const raw = res.raw
  const subj = raw?.SubjectProperty || {}
  const owner = raw?.OwnerInformation || {}
  const ownerVesting = owner?.OwnerVestingInfo || {}
  const mail = owner?.MailingAddress || {}
  const situs = subj?.SitusAddress || {}
  const parsed = subj?.ParsedStreetAddress || {}
  return {
    PropertyId: res.propertyId,
    SitusAddress: {
      StreetAddress: situs.StreetAddress,
      City: situs.City,
      State: situs.State,
      Zip9: situs.Zip9,
      County: situs.County,
      APN: situs.APN,
    },
    ParsedStreetAddress: {
      StandardizedHouseNumber: parsed.StandardizedHouseNumber,
      StandardizedHouseNumberString: parsed.StandardizedHouseNumberString,
      StreetName: parsed.StreetName,
      StreetSuffix: parsed.StreetSuffix,
      DirectionPrefix: parsed.DirectionPrefix,
      DirectionSuffix: parsed.DirectionSuffix,
      ApartmentOrUnit: parsed.ApartmentOrUnit,
    },
    OwnerInformation: {
      OwnerNames: owner.OwnerNames,
      Owner1FullName: owner.Owner1FullName,
      Owner2FullName: owner.Owner2FullName,
      OwnerVestingInfo: ownerVesting,
      MailingAddress: mail,
    },
    LocationInformation: {
      NeighborhoodName: "",
      APN: situs.APN,
    },
  }
}
