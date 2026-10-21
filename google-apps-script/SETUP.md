# Google Sheets estimate intake setup

The website collects Keith's six required fields—name, company name, address, phone, email, and a brief description of the work—and posts estimate requests directly to a Google Apps Script web app. Apps Script validates the request, appends the lead to the Sheet, emails the configured recipients, and exposes a read-only status check so the website confirms that the row was actually saved.

## 1. Sheet and Apps Script

Use the shared Sheet:

- Spreadsheet ID: `1fKcPMTqLMdT6iuPp9hTpZ_KQUQgxq03vFGryemMV4-M`
- Existing tab: `Sheet1`

Under the Google account that owns or can edit the Sheet:

1. Open **Extensions → Apps Script**.
2. Replace the editor contents with `google-apps-script/Code.gs`.
3. Optional Script Property overrides are available for `SPREADSHEET_ID`, `SHEET_NAME`, and `NOTIFY_EMAILS`. The prepared script already defaults to the supplied Sheet, `Sheet1`, and `keith@vosspropertysolutions.com`.
4. Run `setupLeadSheet` once and authorize Google Sheets and email access.

`setupLeadSheet` verifies the live 16-column Sheet schema, formats the header, and installs a 15-minute notification retry trigger. The six customer fields map directly to `Full Name`, `Company Name`, `Phone number`, `Email`, `Address`, and `Brief Project Description`; the remaining columns are operational tracking fields.

## 2. Deploy Apps Script

1. Select **Deploy → New deployment → Web app**.
2. Execute as: **Me**.
3. Who has access: **Anyone**.
4. Deploy and copy the URL ending in `/exec`.

The public form uses a hidden honeypot, strict field validation, stable random lead references, and duplicate prevention. The status endpoint uses a short-lived direct lookup so browser confirmation does not depend on eventually consistent cache timing. It exposes only whether a random UUID lead reference exists; it does not return customer details.

## 3. Configure the website

Add this frontend build variable in Vercel:

- `VITE_GOOGLE_APPS_SCRIPT_URL`: the Apps Script `/exec` deployment URL.
Redeploy after saving the variables. No Vercel Function or server-side Vercel secret is required.

## 4. Acceptance test

1. Open the deployed Voss website.
2. Submit a clearly labeled test lead through the Free Estimate form.
3. Confirm the website displays a lead reference.
4. Confirm exactly one row with that lead ID appears in `Sheet1`.
5. Confirm every configured recipient receives the email and its Sheet link opens the same tracker.
6. Confirm the row's `Notification Status` is `Sent`.
7. Delete the test row after verification.

The production workflow is not complete until both the Sheet row and notification email have been verified.
