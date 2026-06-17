import type {
  Order,
  OrderDetail,
  PrelimData,
  SharedState,
} from "@/app/components/feature/tables/types";
import { PRELIM_COMPANY, PRELIM_DEFAULTS } from "./constants";
import {
  formatAddressFromOrderDetail,
  formatApnFromOrderDetail,
  mapCodeItem,
  stripHtml,
} from "./helpers";

export interface PrelimSources {
  tsri: Record<string, any>;
  shared: Pick<SharedState, "chainCodes" | "effectiveDate" | "vesting" | "legal" | "leaseHold">;
  orderDetail?: OrderDetail | null;
  selectedOrder?: Order | null;
  orderDetailId?: string | null;
}

export function buildPrelimData({
  tsri,
  shared,
  orderDetail,
  selectedOrder,
  orderDetailId,
}: PrelimSources): PrelimData {
  const chain = shared.chainCodes || [];
  const chainExceptions = chain.filter((c) => c.type === "exception");
  const requirements = chain.filter((c) => c.type === "requirement");
  const notes = chain.filter((c) => c.type === "note");
  const taxCerts = Array.isArray(tsri.taxCerts) ? tsri.taxCerts : [];

  const exceptions = [
    ...taxCerts.map(mapCodeItem),
    ...chainExceptions.map(mapCodeItem),
  ];

  const propertyAddress =
    formatAddressFromOrderDetail(orderDetail) ||
    selectedOrder?.addr ||
    "";

  return {
    orderNo: String(
      selectedOrder?.id ?? orderDetail?.id ?? orderDetailId ?? "",
    ),
    fileNo: orderDetail?.clientFileNo || "",
    titleOfficer: orderDetail?.titleOfficer || "",
    titleEmail: orderDetail?.titleOfficerEmail || "",
    titlePhone: PRELIM_COMPANY.phone,
    titleFax: PRELIM_COMPANY.fax,
    propertyAddress,
    effectiveDate:
      tsri.effectiveDate || shared.effectiveDate || PRELIM_DEFAULTS.effectiveDate,
    effectiveTime: PRELIM_DEFAULTS.effectiveTime,
    county: orderDetail?.county || "",
    city: orderDetail?.city || "",
    vestingName: tsri.vesting || shared.vesting || "",
    vestingType: "",
    leaseHold: tsri.leaseHold || shared.leaseHold || "",
    legal: tsri.legal || shared.legal || "",
    apn: formatApnFromOrderDetail(orderDetail),
    exceptions,
    requirements: requirements.map(mapCodeItem),
    notes: notes.map(mapCodeItem),
    easements: tsri.easements || "",
    extraNotes: tsri.notes || "",
  };
}

export function buildPrelimBody(sources: PrelimSources): string {
  const d = buildPrelimData(sources);
  return [
    `PRELIMINARY REPORT — Order No. ${d.orderNo}`,
    `Property: ${d.propertyAddress}`,
    `Effective: ${d.effectiveDate} at ${d.effectiveTime}`,
    `Vesting: ${stripHtml(d.vestingName)}`,
    `Legal: ${stripHtml(d.legal)}`,
    ...d.exceptions.map(
      (e, i) => `Exception ${i + 1}: ${stripHtml(e.verbiage)}`,
    ),
    ...d.requirements.map(
      (r, i) => `Note ${i + 1}: ${stripHtml(r.verbiage)}`,
    ),
  ].join("\n");
}
