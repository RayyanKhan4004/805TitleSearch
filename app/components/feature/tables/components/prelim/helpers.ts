import type { OrderDetail } from "@/app/components/feature/tables/types";

export const looksLikeHtml = (s: string): boolean =>
  /<[a-zA-Z][^>]*>/.test(s || "");

export const stripHtml = (s: string): string =>
  (s || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p\s*>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

export const formatAddressFromOrderDetail = (
  od?: Partial<OrderDetail> | null,
): string => {
  if (!od) return "";
  const streetLine = [
    od.addrNo,
    od.dirPrefix,
    od.streetName,
    od.suffix,
    od.postDir,
    od.unitType,
    od.unitNo,
  ]
    .filter(Boolean)
    .join(" ");
  const cityStateZip =
    [od.city, od.state].filter(Boolean).join(", ") +
    (od.zipCode ? " " + od.zipCode : "");
  return [streetLine, cityStateZip].filter(Boolean).join(", ").trim();
};

export const formatApnFromOrderDetail = (
  od?: Partial<OrderDetail> | null,
): string => {
  if (!od) return "";
  return [od.apn1, od.apn2, od.apn3, od.apn4].filter(Boolean).join("-");
};

export const mapCodeItem = (
  x: { code?: string | null; verbiage?: string | null } | null | undefined,
): { code: string; verbiage: string } => ({
  code: x?.code ?? "",
  verbiage: x?.verbiage ?? "",
});
