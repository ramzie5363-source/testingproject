# AeroTrack site

## Structure

```
index.html                 Home / dashboard — tool grid, ads, support band
privacy.html                Privacy policy (required for AdSense)
ads.txt                      AdSense verification file (must stay at site root)
tools/
  csv-to-gpx.html            Your existing converter, now wrapped with shared nav/footer
partials/
  nav.html                    Shared nav bar (fetched into every page)
  footer.html                 Shared footer (fetched into every page)
assets/
  site.css                    Shared styles: nav, footer, ad slots, modal, home page
  nav.js                      Fetches + injects the partials, handles mobile menu
  usage-tracking.js           Email/location capture modal → Google Sheet
backend/
  Code.gs                      Google Apps Script backend (paste into Apps Script editor)
  README.md                    Step-by-step backend setup
```

This is a **multi-page** static site (not single-page section switching) —
each tool is its own HTML file. On a static host like GitHub Pages this
means real URLs, no router to fight, and adding a new tool later is just
"add a new file to `tools/` and a new card to `index.html`" — nothing else
has to change, since the nav/footer are shared partials.

## Deploying to GitHub Pages

1. Copy everything in this zip into the root of your GitHub Pages repo,
   preserving the folder structure above.
2. Commit and push. If Pages isn't already enabled: repo **Settings → Pages
   → Source → Deploy from branch → main / (root)**.
3. Your home page will be at `https://<username>.github.io/<repo>/`.

### Why it's domain-agnostic

Every page sets two small variables before loading `nav.js`:

```html
<script>
  window.SITE_ROOT = "./";   // "../" for pages one folder deep, like tools/*.html
  window.SITE_PAGE = "home"; // matches a data-page value in partials/nav.html
</script>
```

`nav.js` uses `SITE_ROOT` to fetch the partials and to rewrite every
`__ROOT__` token inside them into working relative links. Nothing is
hardcoded to a domain or a repo name, so this keeps working unchanged
whether you're on `username.github.io/reponame/`, a root user/org Pages
site, or your custom domain once it's connected — you don't have to
touch any file when the domain changes.

## Required setup before going live

1. **Usage tracking** — follow `backend/README.md`, then paste your Apps
   Script URL into `assets/usage-tracking.js` (`TRACKING_ENDPOINT`).
2. **Buy Me a Coffee** — replace `YOUR_USERNAME` in `partials/footer.html`
   and `index.html` with your actual Buy Me a Coffee page slug.
3. **AdSense** — replace every `ca-pub-XXXXXXXXXXXXXXXX` (in `index.html`,
   `tools/csv-to-gpx.html`) with your real publisher ID, and replace the
   `pub-0000000000000000` placeholder in `ads.txt`. Until AdSense approves
   the site, leave the placeholder `<div class="ad-slot-body">` text in
   place — it just shows a dashed placeholder box, nothing breaks.
   AdSense requires a live privacy policy (`privacy.html` — fill in the
   `[DATE]` and `[you@example.org]` placeholders first) and generally
   won't approve a brand-new site instantly; expect a review period.
4. **Owner/About section** — `tools/csv-to-gpx.html` still has the
   `[Your Name]` / `[you@example.org]` placeholders from the converter's
   About section; fill those in.

## Adding a future tool

1. Duplicate `tools/csv-to-gpx.html` as a starting point, or start fresh —
   just keep the `<div id="site-nav">` / `<div id="site-footer">` mount
   points and the two `window.SITE_ROOT` / `SITE_PAGE` + script includes.
2. Add a `data-page="your-new-tool"` entry to `partials/nav.html` if you
   want it in the main nav.
3. Add a `.tool-card` to `index.html`'s tool grid, pointing at the new file.
