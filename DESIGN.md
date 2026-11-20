# Design
## Source of truth
Status: Active. Reviewed existing static HTML/CSS/JS, entries and locale data on 2026-11-20. Surfaces: About, Experience, Projects, detail.
## Brand
Minimal academic CV: quiet confidence, clear evidence, small muted rust accent. Avoid decorative gradients, dense dashboards, and motion that competes with content.
## Product goals
Make the portfolio easy to scan, browse by intent, and download as a resume. Preserve existing detail URLs and entry data.
## Personas and jobs
Recruiters and collaborators scan qualifications, then open selected project details. User maintains one shared record per experience.
## Information architecture
`index.html` About; `experience.html` grouped career, research, leadership, honors, activities; `projects.html` Featured, Industry, Other; `detail.html?id=` for reusable detail records.
## Design principles
SEED semantic color and spacing tokens; UI UX Pro Max hierarchy and contrast; Ponytail reuse and minimum complexity. Every card has a clear title, date, and one action.
## Visual language
White canvas, black/gray typography, thin rules, small orange accent, restrained borders, no photo in PDFs. Responsive two-column desktop and single-column mobile.
## Components
Site header/nav/language switcher, profile block, CV section, entry card, project card, journey timeline, resume download panel, detail article.
## Accessibility
Semantic headings, real links, visible focus, 44px language controls, aria-current navigation, reduced visual density on mobile.
## Responsive behavior
At 800px, the header wraps and the profile becomes a compact row. Projects use two columns, then one below 520px. Resume buttons stack on small screens.
## Interaction states
Current nav and language are explicit; cards underline their title on hover; detail pages retain a back link. Empty detail content shows a pending message.
## Content voice
Short factual labels. Keep Korean and English facts aligned. Never invent metrics or confidential client details.
## Implementation constraints
Static HTML/CSS/JS, existing `entries.js` and locale files, no new runtime dependencies. Resume PDFs are static assets.
## Open questions
Expected graduation remains February 2027, as supplied by the user; do not label it completed graduation.

Sources: [SEED foundations](https://seed-design.io/foundations), [UI UX Pro Max quick reference](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill), [Ponytail skill](https://github.com/DietrichGebert/ponytail).
