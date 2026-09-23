/**
 * AeroTrack usage tracking backend.
 * Deploy this as a Web App (see backend/README.md for step-by-step setup).
 *
 * Expects a POST body of JSON like:
 *   { email, location, page, referrer, timestamp }
 * or a return-visit ping:
 *   { type: "visit", email, location, page, referrer, timestamp }
 */

var SHEET_NAME = "Submissions";

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
    sheet.appendRow(["Received At", "Type", "Email", "Location", "Page", "Referrer", "Client Timestamp"]);
  }

  var data = {};
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    data = {};
  }

  sheet.appendRow([
    new Date(),
    data.type || "signup",
    data.email || "",
    data.location || "",
    data.page || "",
    data.referrer || "",
    data.timestamp || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Lets you sanity-check the deployment by visiting the /exec URL directly in a browser.
function doGet(e) {
  return ContentService
    .createTextOutput("AeroTrack tracking endpoint is live.")
    .setMimeType(ContentService.MimeType.TEXT);
}
