# Usage tracking backend — Google Apps Script (100% free)

This is the simplest possible $0 backend: submissions land directly in a
Google Sheet you can read and filter with zero setup beyond a Google account.

## Setup (5 minutes)

1. Go to [sheets.google.com](https://sheets.google.com) and create a new,
   blank spreadsheet. Name it something like "AeroTrack Usage".

2. In the spreadsheet, go to **Extensions → Apps Script**.

3. Delete the placeholder `function myFunction() {}` code and paste in the
   entire contents of `Code.gs` from this folder.

4. Click **Save** (the disk icon), name the project "AeroTrack Tracking".

5. Click **Deploy → New deployment**.
   - Click the gear icon next to "Select type" and choose **Web app**.
   - Description: anything, e.g. "AeroTrack tracking v1".
   - Execute as: **Me**.
   - Who has access: **Anyone**.
   - Click **Deploy**.

6. The first time, Google will ask you to authorize the script — click
   through **Authorize access → (your account) → Advanced → Go to
   AeroTrack Tracking (unsafe) → Allow**. This warning is normal for
   scripts you wrote yourself; it's not actually unsafe.

7. Copy the **Web app URL** shown (it ends in `/exec`).

8. Open `assets/usage-tracking.js` in the site and paste that URL as the
   value of `TRACKING_ENDPOINT` near the top of the file.

9. Test it: open the live site, fill in the tracking modal, submit, then
   check your Google Sheet — a new row should appear within a few seconds.
   (A "Submissions" tab is created automatically on first submission.)

## Notes

- Free quota is roughly 20,000 requests/day for a personal Google account —
  far more than this will ever need.
- Because Apps Script doesn't return CORS headers the browser can read
  cross-origin, the front-end sends the request in fire-and-forget mode
  (`mode: "no-cors"`). You can't read a success/failure response back in
  JS — verify delivery by checking the sheet instead.
- If you ever redeploy (not just re-save) the script, Apps Script gives you
  a **new** `/exec` URL — update `usage-tracking.js` again if that happens.
  Using **Deploy → Manage deployments → Edit → Deploy** instead of "New
  deployment" keeps the same URL.
- To later upgrade to a "real" database (e.g. for building an admin
  dashboard, querying, or adding login), Supabase's free tier is the
  natural next step — same idea, but the data lands in a Postgres table
  instead of a spreadsheet, and you get a JS client library and row-level
  security instead of a fire-and-forget POST.
