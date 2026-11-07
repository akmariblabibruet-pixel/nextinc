# S6 — Careers, Apply, Contact
**Depends on:** S1 · **Ledger:** `ledger/S6-careers-contact.md`

## Goal
Restyle the three existing pages into the new system **without breaking the working forms** (Web3Forms). Contact is the conversion page: make it feel like writing a letter to a person.

## You own
`career.html`, `apply.html`, `contact.html`, `assets/css/pages/forms.css`, `assets/js/pages/forms.js`, `ledger/S6-careers-contact.md`.

## Steps
1. Read the current three pages first and **list their form fields, endpoints, access key, hidden fields and validation** in your ledger.
2. Rebuild with the new head/shell (copy `work.html`), keep every field name and the Web3Forms POST/endpoint identical.
3. **contact.html** ("Start a *project*."): two-column — left a short "what to tell us" note and the email (`NEXT.site.email`), right an underlined-field form (`.field`) with project type chips as radio inputs (Website, App, SaaS, AI/LLM, Research, Not sure — add as a plain text field value, keep existing field names), budget range optional, message. Inline success/error (`.form-msg`), button disabled while sending, honeypot kept.
4. **career.html**: open roles listed like a table of contents; each links to `apply.html?role=<slug>`. Use only roles that exist on the old page.
5. **apply.html**: same form language; role pre-filled from the query string; file inputs unchanged.

## Acceptance
Test each form end-to-end (or with the Web3Forms test mode) and record results in the ledger; labels linked to inputs; errors announced (`aria-live`); works with keyboard and on 360 px.

## Before you start
Read `docs/REDESIGN_PLAN.md`, `docs/DESIGN_SYSTEM.md`, `docs/WORKFLOW.md`; open `/styleguide.html` (run `npm run serve`). Use only components and tokens from the style guide. The site is **showcase-first**: the visitor must quickly see projects, films and how we work. Never invent facts, numbers or awards — use data from `assets/data/*.js` or leave a clearly marked `sample: true` placeholder.

## Deliver
Fill `ledger/<your file>`, run `npm run check`, commit, `git format-patch main --stdout > patches/<stage>.patch` (see WORKFLOW.md).
