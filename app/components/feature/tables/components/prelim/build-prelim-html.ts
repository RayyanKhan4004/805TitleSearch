import type { PrelimData } from "@/app/components/feature/tables/types";

const esc = (s: string | undefined | null) =>
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
        `<p style="margin:0 0 10px 0;"><strong>${start + i}.</strong>&nbsp;${richOrText(verbiage)}</p>`,
    )
    .join("");

const BOILERPLATE_1 =
  "In response to the above referenced application for a policy of title insurance, Westcor Land Title Insurance Company hereby reports that it is prepared to issue, or cause to be issued, as of the date hereof, a Policy or Policies of Title Insurance describing the land and the estate or interest therein hereinafter set forth, insuring against loss which may be sustained by reason of any defect, lien or encumbrance not shown or referred to as an Exception in Schedule B or not excluded from coverage pursuant to the printed Schedules, Conditions and Stipulations of said Policy forms.";

const BOILERPLATE_2 =
  "The printed Exceptions and Exclusions from the coverage of said Policy or Policies are set forth in Exhibit A attached. Copies of the Policy forms should be read. They are available from the office which issued this report.";

const ROW = (label: string, value: string) => `
  <tr>
    <td style="border:1px solid #ccc;padding:7px 12px;background:#f5f5f5;width:30%;font-weight:600;white-space:nowrap;">${label}</td>
    <td style="border:1px solid #ccc;padding:7px 12px;">${value}</td>
  </tr>`;

export function buildPrelimReportHtml(data: PrelimData): string {
  const leaseHoldSuffix = data.leaseHold ? ` / ${esc(data.leaseHold)}` : "";

  const exceptionsHtml =
    data.exceptions.length === 0 && !data.easements
      ? `<p style="margin:0 0 10px 0;"><em>No exceptions recorded.</em></p>`
      : numbered([
          ...data.exceptions.map((e) => e.verbiage),
          ...(data.easements ? [data.easements] : []),
        ]);

  const infoNotesHtml =
    data.requirements.length === 0 && data.notes.length === 0 && !data.extraNotes
      ? `<p style="margin:0 0 10px 0;"><em>No informational notes recorded.</em></p>`
      : numbered([
          ...data.requirements.map((r) => r.verbiage),
          ...(data.extraNotes ? [data.extraNotes] : []),
          ...data.notes.map((n) => n.verbiage),
        ]);

  const attnLines = [data.customer1Contact, data.customer1Name, data.customer1Address, data.customer1CityState]
    .filter(Boolean)
    .map((line) => esc(line))
    .join("<br>");

  return `
<div style="font-family:'Times New Roman',Times,serif;font-size:11.5px;line-height:1.65;color:#111;">

  <!-- ═══════════════ LETTERHEAD ═══════════════ -->
  <div style="text-align:center;margin-bottom:6px;">
    <span style="font-family:Georgia,'Times New Roman',serif;font-size:52px;font-weight:700;color:#1B2A4A;letter-spacing:-1px;">805<em>title</em></span>
  </div>
  <div style="text-align:center;line-height:1.8;margin-bottom:4px;color:#333;font-size:11px;">
    31344 Via Colinas #106, Westlake Village, CA 91362<br>
    Tel: ${esc(data.titlePhone)}&nbsp;&nbsp;&nbsp;Fax: ${esc(data.titleFax)}
  </div>
  <div style="text-align:right;font-weight:700;margin-bottom:24px;font-size:11px;">
    Order No.:&nbsp;${esc(data.orderNo)}
  </div>

  <hr style="border:none;border-top:2px solid #1B2A4A;margin:0 0 18px 0;">

  <!-- ═══════════════ ATTN BLOCK ═══════════════ -->
  ${
    attnLines
      ? `<div style="margin-bottom:18px;line-height:1.8;">
    ${attnLines}
  </div>`
      : ""
  }

  <p style="margin:0 0 4px 0;"><strong>RE:</strong>&nbsp;&nbsp;${esc(data.propertyAddress)}</p>
  ${data.customer1Ref ? `<p style="margin:0 0 18px 0;"><strong>Your Ref:</strong>&nbsp;&nbsp;${esc(data.customer1Ref)}</p>` : `<div style="margin-bottom:18px;"></div>`}

  <!-- ═══════════════ TITLE ═══════════════ -->
  <h2 style="text-align:center;font-size:14px;font-weight:700;margin:0 0 4px 0;letter-spacing:1px;">PRELIMINARY REPORT</h2>
  <p style="text-align:center;margin:0 0 18px 0;font-size:11px;">
    Dated as of <strong>${esc(data.effectiveDate)}</strong> at ${esc(data.effectiveTime)}
  </p>

  <hr style="border:none;border-top:1px solid #ccc;margin:0 0 14px 0;">

  <!-- ═══════════════ BOILERPLATE ═══════════════ -->
  <p style="text-align:justify;margin:0 0 10px 0;">${esc(BOILERPLATE_1)}</p>
  <p style="text-align:justify;margin:0 0 10px 0;">${esc(BOILERPLATE_2)}</p>
  <p style="text-align:justify;font-weight:700;margin:0 0 10px 0;">
    Please read the exceptions shown or referred to below and the exceptions and exclusions set forth in Exhibit A of this report carefully.
    The exceptions and exclusions are meant to provide you with notice of matters which are not covered under the terms of the title insurance policy and should be carefully considered.
  </p>
  <p style="text-align:justify;font-weight:700;margin:0 0 10px 0;">
    It is important to note that this preliminary report is not a written representation as to the condition of title and may not list all liens, defects, and encumbrances affecting title to the land.
  </p>
  <p style="text-align:justify;margin:0 0 10px 0;">
    This report (and any supplements or amendments hereto) is issued solely for the purpose of facilitating the issuance of a policy of title insurance and no liability is assumed hereby.
  </p>
  <p style="text-align:justify;font-style:italic;margin:0 0 24px 0;">
    The policy(s) of title insurance to be issued hereunder will be policy(s) of ${esc(data.underwriterName || "Westcor Land Title Insurance Company")}.
  </p>

  <!-- ═══════════════ SCHEDULE ═══════════════ -->
  <h2 style="text-align:center;font-size:13px;font-weight:700;margin:0 0 10px 0;letter-spacing:1px;">PRELIMINARY REPORT</h2>

  <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:11.5px;">
    <tbody>
      ${ROW("File Number:", esc(data.orderNo))}
      ${data.fileNo ? ROW("Client File No.:", esc(data.fileNo)) : ""}
      ${ROW("Title Officer:", `${esc(data.titleOfficer)}${data.TOInitials ? " (" + esc(data.TOInitials) + ")" : ""}`)}
      ${ROW("Effective Date:", `<strong>${esc(data.effectiveDate)}</strong> at ${esc(data.effectiveTime)}`)}
      ${ROW("Property Address:", esc(data.propertyAddress))}
      ${ROW("Amount of Insurance:", data.amountOfInsurance ? esc(data.amountOfInsurance) : "&nbsp;")}
    </tbody>
  </table>

  <!-- ═══════════════ SCHEDULE ITEMS 1-3 ═══════════════ -->
  <p style="margin:0 0 6px 0;"><strong>1.</strong>&nbsp;The estate or interest in the land hereinafter described or referred to covered by this Report is:</p>
  <p style="margin:0 0 16px 0;padding-left:22px;font-weight:600;">Fee Simple${leaseHoldSuffix}</p>

  <p style="margin:0 0 6px 0;"><strong>2.</strong>&nbsp;Title to said estate or interest at the date hereof is vested in:</p>
  <p style="margin:0 0 16px 0;padding-left:22px;color:#0F3460;font-weight:600;">
    ${data.vestingName ? richOrText(data.vestingName) : "<em style='font-weight:400;color:#666;'>(Vesting not entered)</em>"}${data.vestingType ? ", " + esc(data.vestingType) : ""}
  </p>

  <p style="margin:0 0 6px 0;"><strong>3.</strong>&nbsp;The land referred to in this Report is situated in the State of California, County of <strong>${esc(data.county)}</strong>, and is described as follows:</p>
  <p style="margin:0 0 20px 0;padding-left:22px;">The land is described as set forth in Exhibit A attached hereto and made a part hereof.</p>

  <!-- ═══════════════ EXCEPTIONS ═══════════════ -->
  <p style="text-align:justify;margin:0 0 12px 0;">
    As of the date hereof, items to be considered and exceptions to coverage in addition to the printed exceptions and exclusions in said policy form would be as follows:
  </p>
  ${exceptionsHtml}

  <hr style="border:none;border-top:1px solid #ccc;margin:24px 0 14px 0;">

  <!-- ═══════════════ INFORMATIONAL NOTES ═══════════════ -->
  <h3 style="font-size:12px;font-weight:700;margin:0 0 12px 0;letter-spacing:0.5px;">INFORMATIONAL NOTES:</h3>
  ${infoNotesHtml}

  <hr style="border:none;border-top:1px solid #ccc;margin:24px 0 20px 0;">

  <!-- ═══════════════ EXHIBIT A ═══════════════ -->
  <h2 style="text-align:center;font-size:13px;font-weight:700;margin:0 0 14px 0;letter-spacing:1px;">EXHIBIT A</h2>
  <p style="text-align:justify;margin:0 0 10px 0;">
    The Land referred to herein below is situated in the City of <strong>${esc(data.city || data.propertyCity || "")}</strong>,
    County of <strong>${esc(data.county)}</strong>, State of California, and is described as follows:
  </p>
  <p style="margin:0 0 10px 0;">APN:&nbsp;<strong>${esc(data.apn)}</strong></p>
  <div style="margin:0 0 32px 0;padding:12px 16px;border-left:3px solid #1B2A4A;background:#fafafa;white-space:pre-wrap;font-size:11px;">
    ${data.legal ? richOrText(data.legal) : "<em style='color:#666;'>(Legal description not entered in Legal &amp; Vesting section)</em>"}
  </div>

  <p style="text-align:center;color:#888;margin-top:40px;padding-top:12px;border-top:1px solid #ddd;font-size:10px;">
    — End of Preliminary Report —<br>
    <span style="font-size:9px;">Order No. ${esc(data.orderNo)} &nbsp;·&nbsp; 805Title Inc. &nbsp;·&nbsp; Tel: ${esc(data.titlePhone)}</span>
  </p>

</div>
`.trim();
}
