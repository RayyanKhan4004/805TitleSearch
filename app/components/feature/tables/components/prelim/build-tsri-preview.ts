import type {
  ChainCode,
  Order,
  OrderDetail,
} from "@/app/components/feature/tables/types";
import { formatAddressFromOrderDetail, formatApnFromOrderDetail } from "./helpers";

const DIVIDER =
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

export interface TsriPreviewSources {
  effectiveDate: string;
  effectiveTime: string;
  leaseHold: string;
  vesting: string;
  legal: string;
  easements: string;
  notes: string;
  exceptions: ChainCode[];
  requirements: ChainCode[];
  notesCodes: ChainCode[];
  orderDetail?: OrderDetail | null;
  selectedOrder?: Order | null;
}

const section = (title: string, body: string) =>
  `${DIVIDER}\n${title}\n${DIVIDER}\n\n${body}`;

const numberedLines = (
  items: ChainCode[],
  label: (i: number) => string,
): string =>
  items.map((c, i) => `${label(i)}. ${c.verbiage}`).join("\n\n");

export function buildTsriPreviewBody({
  effectiveDate,
  effectiveTime,
  leaseHold,
  vesting,
  legal,
  easements,
  notes,
  exceptions,
  requirements,
  notesCodes,
  orderDetail,
  selectedOrder,
}: TsriPreviewSources): string {
  const orderNo = String(
    selectedOrder?.id ?? orderDetail?.id ?? "",
  );
  const propertyAddress =
    formatAddressFromOrderDetail(orderDetail) || selectedOrder?.addr || "";
  const apn = formatApnFromOrderDetail(orderDetail);

  const exceptionLines = numberedLines(exceptions, (i) => String(i + 1));
  const requirementLines = numberedLines(requirements, (i) => String(i + 1));
  const noteLines = numberedLines(notesCodes, (i) =>
    String.fromCharCode(65 + i),
  );

  return [
    "PRELIMINARY REPORT",
    "",
    `Order No.: ${orderNo}                          Date: ${effectiveDate}`,
    `Property: ${propertyAddress}`,
    "",
    section(
      "SCHEDULE A",
      [
        `1. Effective Date: ${effectiveDate} at ${effectiveTime}`,
        "",
        "2. Policy or Policies to be issued:",
        "   CLTA Standard Coverage Policy – Owner's",
        "   Amount of Insurance: $485,000.00",
        "",
        "   ALTA Lender's Policy",
        "   Amount of Insurance: (Loan Amount TBD)",
        "",
        `3. The estate or interest in the land described herein is${
          leaseHold ? " a LEASEHOLD." : " a FEE."
        }`,
        leaseHold ? `   Leasehold Note: ${leaseHold}` : "",
        "",
        "4. Title to said estate or interest at the date hereof is vested in:",
        `   ${vesting}`,
        "",
        "5. The land referred to in this Report is described as follows:",
        `   ${legal}`,
        "",
        `   APN: ${apn}`,
      ].join("\n"),
    ),
    "",
    section(
      "SCHEDULE B – REQUIREMENTS",
      requirementLines || "No requirements added yet.",
    ),
    "",
    section(
      "SCHEDULE B – EXCEPTIONS",
      (exceptionLines || "No exceptions added yet.") +
        (easements ? `\n\nAdditional Easements:\n${easements}` : ""),
    ),
    "",
    section(
      "NOTES",
      (noteLines || "No notes added yet.") + (notes ? `\n\n${notes}` : ""),
    ),
    "",
    DIVIDER,
    "Authorized Signatory: _________________________",
    "",
  ].join("\n");
}
