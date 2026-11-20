# Validation — 2026-11-20

Verified against the local static HTTP server, using headless Google Chrome via Playwright:

- 48 route, language, detail, download and bookmark scenarios passed; zero JavaScript page errors.
- Direct requests to index/About, Experience and Projects in Korean and English at 375px and 1280px widths.
- All 27 entries render a detail page; language switching retains IDs and activity dates.
- All internal links on those overview pages return HTTP success.
- Parent links render on child detail pages; internship projects expand via the preserved `open` query.
- Both About download buttons produce their expected PDF filename without download failure.
- Legacy `index.html?filter=career`, `?filter=project`, and `#timeline` URLs redirect to useful new sections.
- No horizontal overflow at either tested viewport. Desktop/mobile About and Projects screenshots reviewed.

PDF checks using Poppler and pypdf:

- Both final documents contain two A4 pages, with searchable/extractable text.
- Korean name and contact text extracted successfully.
- Nanum Gothic Regular/Bold embedded with Unicode maps (`pdffonts`).
- Each PDF has four active link annotations: email, GitHub, LinkedIn and portfolio.
- Both pages rendered and visually reviewed for line wrapping, margins and clipping.

Static checks: `node --check` on all JavaScript sources and `git diff --check` passed.

Deployment verification is recorded below after publishing.
