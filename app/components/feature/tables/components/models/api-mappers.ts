import type { Order } from "@/app/components/feature/tables/types";

export function mapOrdersResponse(items: Record<string, any>[]): Order[] {
  return items.map((item) => {
    const no = String(item.orderNumber ?? item.no ?? "");
    const apn1 = item.apn1 ?? "";
    const street = [
      item.addrNo,
      item.dirPrefix,
      item.streetName,
      item.suffix,
      item.postDir,
    ]
      .filter(Boolean)
      .join(" ");
    const city = item.city ?? "";
    const state = item.state ?? "";
    const zipCode = item.zipCode ?? "";
    const addr = [street, city].filter(Boolean).join(", ");
    const owner = "";
    const county = item.county ?? "";
    const fileNo = item.clientFileNo ?? "";
    const productType = item.productType ?? "";
    const status = (item.status || "Open") as Order["status"];
    const date = item.estimatedClosingDate ?? "";
    const transactionType = item.transactionType ?? "";

    return {
      no,
      apn: apn1,
      apn1,
      zipCode,
      addr,
      owner,
      county,
      fileNo,
      productType,
      status,
      date,
      streetName: item.streetName ?? "",
      city,
      state,
      clientName: item.clientName ?? "",
      transactionType,
      sourceOfBusiness: item.sourceOfBusiness ?? "",
      loanAmount: item.loanAmount ?? "",
      loanNumber: item.loanNumber ?? "",
      titleOffice: item.titleOffice ?? "",
      escrowOffice: item.escrowOffice ?? "",
      titleBranchReview: item.titleBranchReview ?? "",
      loanOfficer: item.loanOfficer ?? "",
      lenderBank: item.lenderBank ?? "",
      id: item.id,
    };
  });
}
