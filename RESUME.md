# Resume content and regeneration

The website and both PDFs read `entries.js` (dates, contact links and selected IDs) and `locales/ko.js` / `locales/en.js` (names, roles and summaries). PDF output is checked into `assets/resumes/` so GitHub Pages serves it without a build service.

Rebuild with Node.js, Python 3 and ReportLab (generation tool only):

```sh
python -m venv .venv
.venv/bin/pip install reportlab
.venv/bin/python scripts/build_resume.py
```

Nanum Gothic Regular and Bold are bundled under the SIL Open Font License in `assets/fonts/OFL.txt` and embedded in the generated PDFs. Website users need no extra dependency.

Before publishing, open both PDFs, confirm two A4 pages, selectable Korean text, right-aligned dates and four working contact links. Both PDF filenames must match the About download links.

## Confirmed resume source

The user supplied the final Korean and English copy on 2026-11-20. The public resumes include the supplied 3.8 / 4.5 GPA, 2026 research period, planning responsibilities, verified tools and military service dates. February 2027 remains expected graduation. The two-page layout preserves all supplied sections and bullets.

No unverified metrics or confidential PoC material are included. Project thumbnails are abstract illustrations, not client screenshots. The society's official English name is The Korean Association of Data Science (KADS): https://www.koreadatascience.org/about?tab=Regulation.

## Public detail schema

Entry copy in either locale may include `sections: [{title, text}]`, `qa: [{question, answer}]`, `media: [{type: "image" | "video", src, alt, caption}]`, and `links: [{label, url}]`. Use only approved public assets and links. Existing `related: [{id, label}]` and `parentId` relationships are preserved. Missing content shows the existing pending message rather than fictional case studies.
