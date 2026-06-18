import type { PrelimData } from "@/app/components/feature/tables/types";
import { BOIL1, BOIL2 } from "../temp";

const esc = (s: string) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const hasHtml = (s: string) => /<[a-zA-Z][^>]*>/.test(s || "");

const richOrText = (s: string) => (hasHtml(s) ? s : esc(s));

const numbered = (items: string[], start = 1) =>
  items
    .map(
      (verbiage, i) =>
        `<p><strong>${start + i}.</strong>&nbsp;${richOrText(verbiage)}</p>`,
    )
    .join("");

export function buildPrelimReportHtml(data: PrelimData): string {
  const exceptionsHtml =
    data.exceptions.length === 0 && !data.easements
      ? `<p><em>No exceptions recorded in TSRI.</em></p>`
      : numbered([
          ...data.exceptions.map((e) => e.verbiage),
          ...(data.easements ? [data.easements] : []),
        ]);

  const requirementsHtml =
    data.requirements.length === 0 &&
    data.notes.length === 0 &&
    !data.extraNotes
      ? `<p><em>No notes recorded in TSRI.</em></p>`
      : numbered([
          ...data.requirements.map((r) => r.verbiage),
          ...(data.extraNotes ? [data.extraNotes] : []),
          ...data.notes.map((n) => n.verbiage),
        ]);

  const leaseHoldSuffix = data.leaseHold ? ` / ${esc(data.leaseHold)}` : "";

  return `
<div class="prelim-letterhead">
  <p style="text-align:right;font-weight:700;margin:0 0 24px 0;">Order No.: ${esc(data.orderNo)}</p>
  <p style="text-align:center;margin:0 0 6px 0;"><span style="font-family:Georgia,'Times New Roman',serif;font-size:54px;font-weight:700;color:#1B2A4A;letter-spacing:-1px;">805<em>title</em></span></p>
  <p style="text-align:center;line-height:1.9;margin:0 0 36px 0;color:#333;">31344 Via Colinas #106<br>Westlake Village, CA 91362<br>Tel: ${esc(data.titlePhone)}&nbsp;&nbsp;Fax: ${esc(data.titleFax)}</p>
  <p style="margin:0;"><strong>ORDER NO.</strong>&nbsp;&nbsp;${esc(data.orderNo)}</p>
  <p style="margin:0;"><strong>TITLE OFFICER:</strong>&nbsp;&nbsp;${esc(data.titleOfficer)}</p>
  <p style="margin:0;"><strong>Email:</strong>&nbsp;&nbsp;${esc(data.titleEmail)}</p>
  <p style="margin:0;"><strong>PHONE:</strong>&nbsp;&nbsp;${esc(data.titlePhone)}</p>
  <p style="margin:0 0 40px 0;"><strong>FAX:</strong>&nbsp;&nbsp;${esc(data.titleFax)}</p>
  <p style="margin:0;"><strong>PROPERTY ADDRESS:</strong>&nbsp;&nbsp;${esc(data.propertyAddress)}</p>
  <p style="margin:0 0 20px 0;">Dated: <strong>${esc(data.effectiveDate)}</strong> at ${esc(data.effectiveTime)}</p>
</div>

<h2 style="text-align:center;font-weight:700;margin:0 0 6px 0;">PRELIMINARY REPORT</h2>
<hr>

<p style="text-align:justify;">${esc(BOIL1)}</p>
<p style="text-align:justify;">${esc(BOIL2)}</p>
<p style="text-align:justify;font-weight:700;">Please read the exceptions shown or referred to below and the exceptions and exclusions set forth in Exhibit A of this report carefully. The exceptions and exclusions are meant to provide you with notice of matters which are not covered under the terms of the title insurance policy and should be carefully considered.</p>
<p style="text-align:justify;font-weight:700;">It is important to note that this preliminary report is not a written representation as to the condition of title and may not list all liens, defects, and encumbrances affecting title to the land.</p>
<p style="text-align:justify;">This report (and any supplements or amendments hereto) is issued solely for the purpose of facilitating the issuance of a policy of title insurance and no liability is assumed hereby.</p>
<p style="text-align:justify;font-style:italic;">The policy(s) of title insurance to be issued hereunder will be policy(s) of Westcor Land Title Insurance Company.</p>

<h2 style="text-align:center;font-weight:700;margin:24px 0 8px 0;">PRELIMINARY REPORT</h2>

<table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
  <tbody>
    <tr><td style="border:1px solid #ccc;padding:7px 12px;background:#f9f9f9;width:28%;">File Number:</td><td style="border:1px solid #ccc;padding:7px 12px;">${esc(data.orderNo)}</td></tr>
    <tr><td style="border:1px solid #ccc;padding:7px 12px;background:#f9f9f9;">Address Reference:</td><td style="border:1px solid #ccc;padding:7px 12px;">${esc(data.propertyAddress)}</td></tr>
    <tr><td style="border:1px solid #ccc;padding:7px 12px;background:#f9f9f9;">Effective Date:</td><td style="border:1px solid #ccc;padding:7px 12px;"><strong>${esc(data.effectiveDate)}</strong> at ${esc(data.effectiveTime)}</td></tr>
  </tbody>
</table>

<p><strong>1.</strong>&nbsp;The estate or interest in the land hereinafter described or referred to covered by this Report is:</p>
<p style="margin-left:22px;">Fee Simple${leaseHoldSuffix}</p>

<p><strong>2.</strong>&nbsp;Title to said estate or interest at the date hereof is vested in:</p>
<p style="margin-left:22px;color:#0F3460;font-weight:600;">${data.vestingName ? richOrText(data.vestingName) : "(Vesting not entered)"}${data.vestingType ? ", " + esc(data.vestingType) : ""}</p>

<p><strong>3.</strong>&nbsp;The land referred to in this Report is situated in the State of California, County of <strong>${esc(data.county)}</strong>, and is described as follows:</p>
<p style="margin-left:22px;">The land is described as set forth in Exhibit A attached hereto and made a part hereof.</p>

<p style="text-align:justify;margin-top:24px;">As of the date hereof items to be considered and exceptions to coverage in addition to the printed exceptions and exclusions in said policy form would be as follows:</p>
${exceptionsHtml}

<hr>

<h3 style="font-weight:700;margin:24px 0 10px 0;">INFORMATIONAL NOTES:</h3>
${requirementsHtml}

<hr>

<h2 style="text-align:center;font-weight:700;margin:32px 0 14px 0;">EXHIBIT A</h2>
<p style="text-align:justify;">The Land referred to herein below is situated in the City of <strong>${esc(data.city)}</strong>, County of <strong>${esc(data.county)}</strong>, State of California, and is described as follows:</p>
<p>APN:&nbsp;<strong>${esc(data.apn)}</strong></p>
<p style="text-align:justify;font-weight:700;white-space:pre-wrap;">${data.legal ? richOrText(data.legal) : "(Legal description not entered in Legal &amp; Vesting section)"}</p>

<p style="text-align:center;color:#888;margin-top:48px;border-top:1px solid #ddd;padding-top:12px;">— End of Preliminary Report —</p>
`.trim();
}
