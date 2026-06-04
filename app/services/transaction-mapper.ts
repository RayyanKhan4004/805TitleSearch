import type { IndexRow } from "@/app/components/feature/tables/types";

export interface Transaction {
  Id: number;
  Type: number;
  TypeDescription: "SALE" | "FINANCE" | "RELEASE" | "FORECLOSURE" | "ASSIGNMENT";
  TxDate: string | null;
  DocDate: string | null;
  DocType: string;
  BuyerBorrower: string | null;
  SellerLender: string | null;
  Amount: number | null;
  DocId: string;
  BookPage: string;
  FinanceDocumentTypeCode: string;
  SaleDeedTypeDamarCode: string;
  DocTypeDamarCode: string | null;
}

const ENTITY_MAP: Record<string, string> = {
  SALE: "XFER",
  FINANCE: "DOT",
  RELEASE: "REL",
  FORECLOSURE: "FORC",
  ASSIGNMENT: "ASN",
};

function splitBookPage(bp: string): [string, string] {
  if (!bp) return ["", ""];
  const sep = bp.match(/^(.+?)[\/\-](.+)$/);
  return sep ? [sep[1].trim(), sep[2].trim()] : [bp, ""];
}

export function mapTransactionsToIndexRows(txns: Transaction[] | undefined): IndexRow[] {
  if (!txns?.length) return [];
  return txns.map((t, i) => {
    const [book, pg] = splitBookPage(t.BookPage);
    const abbr =
      t.FinanceDocumentTypeCode ||
      (t.TypeDescription === "SALE" ? t.SaleDeedTypeDamarCode : "") ||
      t.DocTypeDamarCode ||
      "";
    return {
      _id: `txn-${i}`,
      rec: t.DocDate || t.TxDate || "",
      abbr,
      entity: ENTITY_MAP[t.TypeDescription] || "MISC",
      docTitle: t.DocType,
      instr: t.DocId,
      book,
      pg,
      grantor: t.SellerLender || "",
      grantee: t.BuyerBorrower || "",
      parentInstr: null,
    };
  });
}
