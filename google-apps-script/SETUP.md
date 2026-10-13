# Google Sheets estimate intake setup

The website posts validated estimate requests to `/api/estimate`. The Vercel Function forwards each lead to the Google Apps Script in `Code.gs`, which appends a row and then emails the configured recipients.

## 1. Create the Sheet and Apps Script

1. Create a Google Sheet owned by the Voss business Google account.
2. Open **Extensions → Apps Script**.
3. Replace the editor contents with `google-apps-script/Code.gs`.
4. In Apps Script, open **Project Settings → Script properties** and create:
   - `SPREADSHEET_ID`: the ID between `/d/` and `/edit` in the Sheet URL.
   - `SHEET_NAME`: `Estimate Leads`.
   - `NOTIFY_EMAILS`: comma-separated notification recipients.
   - `LEAD_WEBHOOK_SECRET`: a long random value. Use the same value in Vercel.
5. Run `setupLeadSheet` once and authorize access to Google Sheets and email.

`setupLeadSheet` also installs a 15-minute retry trigger. If a lead is saved but email delivery fails, the `Notification Status` column records the failure and the trigger retries it without creating a duplicate lead.

## 2. Deploy the Apps Script

1. Select **Deploy → New deployment → Web app**.
2. Execute as: **Me**.
3. Who has access: **Anyone**. The shared secret still protects writes.
4. Deploy and copy the `/exec` URL.

Do not put the Apps Script URL or webhook secret in frontend variables beginning with `VITE_`.

## 3. Configure Vercel

Create a free Cloudflare Turnstile widget for the production and preview domains, then add these environment variables for Production and Preview:

- `GOOGLE_APPS_SCRIPT_URL`: the Apps Script `/exec` deployment URL.
- `LEAD_WEBHOOK_SECRET`: the same random value stored in Apps Script properties.
- `TURNSTILE_SECRET_KEY`: the Turnstile server-side secret.
- `VITE_TURNSTILE_SITE_KEY`: the Turnstile public site key used by the form.

Redeploy after saving the variables.

## 4. Acceptance test

1. Open the deployed Voss website.
2. Submit a clearly labeled test lead through the Free Estimate form.
3. Confirm the website returns a lead reference.
4. Confirm exactly one row with that lead ID appears in the `Estimate Leads` sheet.
5. Confirm every configured recipient receives the email and its Sheet link opens the same lead tracker.
6. Confirm the row's `Notification Status` is `Sent`.
7. Delete the test row after verification.

The production workflow is not complete until both the Sheet row and notification email have been verified.
