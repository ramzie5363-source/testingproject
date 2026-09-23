(function () {
  // ============================================================
  // TODO: paste your Apps Script Web App URL here (ends in /exec)
  // See backend/README.md for how to get this.
  // ============================================================
  var TRACKING_ENDPOINT = "https://script.google.com/macros/s/AKfycbyENniRkpQQRLSQpaG9OkssFShmU7Bqz55EsqQJn6Q33HupuAfY8X5ivnFIB62SJcE8/exec";

  var STORAGE_KEY = "aerotrack_user";
  var SKIP_KEY = "aerotrack_track_skip_until";

  function alreadyRegistered() {
    try {
      return !!localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return false;
    }
  }

  function skippedRecently() {
    try {
      var until = parseInt(localStorage.getItem(SKIP_KEY) || "0", 10);
      return Date.now() < until;
    } catch (e) {
      return false;
    }
  }

  function send(payload) {
    if (!TRACKING_ENDPOINT || TRACKING_ENDPOINT.indexOf("PASTE_YOUR") === 0) {
      console.warn("[usage-tracking] TRACKING_ENDPOINT not configured — skipping send.", payload);
      return;
    }
    // Apps Script web apps don't return CORS headers fetch can read from
    // another origin, so this is a fire-and-forget request: we send the
    // data (no-cors + text/plain avoids a failed CORS preflight) and don't
    // try to read the response. Verify delivery by checking the sheet.
    fetch(TRACKING_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    }).catch(function () {
      /* offline or blocked — nothing more we can do client-side */
    });
  }

  function buildModal() {
    var overlay = document.createElement("div");
    overlay.className = "ut-overlay";
    overlay.innerHTML =
      '<div class="ut-card" role="dialog" aria-modal="true" aria-labelledby="ut-title">' +
      '  <h2 id="ut-title">Quick intro</h2>' +
      "  <p>AeroTrack is free to use. Telling us your email and project location " +
      "helps us understand who relies on it and prioritize what to build next.</p>" +
      '  <form id="ut-form">' +
      '    <label for="ut-email">Email</label>' +
      '    <input id="ut-email" type="email" required placeholder="you@organization.org">' +
      '    <label for="ut-location">Project / landscape location</label>' +
      '    <input id="ut-location" type="text" required placeholder="e.g. Tenasserim Hills, Myanmar">' +
      '    <div class="ut-actions">' +
      '      <button type="button" class="ut-skip">Maybe later</button>' +
      '      <button type="submit" class="ut-submit">Continue</button>' +
      "    </div>" +
      "  </form>" +
      "</div>";
    return overlay;
  }

  function showModal() {
    var overlay = buildModal();
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";

    function close() {
      overlay.remove();
      document.body.style.overflow = "";
    }

    overlay.querySelector(".ut-skip").addEventListener("click", function () {
      try {
        var fourteenDays = 14 * 24 * 60 * 60 * 1000;
        localStorage.setItem(SKIP_KEY, String(Date.now() + fourteenDays));
      } catch (e) {}
      close();
    });

    overlay.querySelector("#ut-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var email = overlay.querySelector("#ut-email").value.trim();
      var location = overlay.querySelector("#ut-location").value.trim();
      if (!email || !location) return;

      var payload = {
        email: email,
        location: location,
        page: window.location.pathname,
        referrer: document.referrer || "",
        timestamp: new Date().toISOString()
      };
      send(payload);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ email: email, location: location }));
      } catch (e) {}

      close();
    });
  }

  function pingReturnVisit() {
    try {
      var stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!stored) return;
      send({
        type: "visit",
        email: stored.email,
        location: stored.location,
        page: window.location.pathname,
        referrer: document.referrer || "",
        timestamp: new Date().toISOString()
      });
    } catch (e) {}
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (alreadyRegistered()) {
      pingReturnVisit();
      return;
    }
    if (skippedRecently()) return;
    showModal();
  });
})();
