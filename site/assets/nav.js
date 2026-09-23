(function () {
  // Each page sets window.SITE_ROOT ("./" at site root, "../" one folder deep)
  // and window.SITE_PAGE (matches a data-page value in partials/nav.html)
  // BEFORE loading this script.
  var root = window.SITE_ROOT || "./";
  var page = window.SITE_PAGE || "";

  function inject(partialPath, mountId, onDone) {
    var mount = document.getElementById(mountId);
    if (!mount) return;
    fetch(root + partialPath)
      .then(function (r) {
        if (!r.ok) throw new Error("partial not found: " + partialPath);
        return r.text();
      })
      .then(function (html) {
        html = html.split("__ROOT__").join(root);
        mount.innerHTML = html;
        if (onDone) onDone(mount);
      })
      .catch(function (err) {
        // Fail quietly — a missing partial shouldn't break the page.
        console.warn("[site nav]", err.message);
      });
  }

  inject("partials/nav.html", "site-nav", function (mount) {
    var active = mount.querySelector('[data-page="' + page + '"]');
    if (active) active.classList.add("active");

    var toggle = mount.querySelector(".st-nav-toggle");
    var links = mount.querySelector(".st-nav-links");
    if (toggle && links) {
      toggle.addEventListener("click", function () {
        var open = links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
  });

  inject("partials/footer.html", "site-footer");
})();
