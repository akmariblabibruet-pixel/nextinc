---
stage: S6
name: Careers, Apply, Contact
status: done
owner: Claude (Sonnet 5.5)
depends: S1
---
## Done
- `contact.html` — "Start a *project*." Two columns: left is a lettered "What to tell us" list, a † note, the public email (`NEXT.site.email`) and the hubs; right is the form set as a letter on a paper-2 sheet ("To Next Inc.", today's date, project-type radios, underlined fields, a ruled message box under "Dear Next Inc.,", "Sincerely," and the send button).
- `career.html` — open roles listed like a table of contents (number, title, dotted leader, "Apply →"), each linking to `apply.html?role=<slug>`; description and tags below. Only the one role that existed on the old page.
- `apply.html` — same letter/field language; role pre-filled from `?role=<slug>` (hidden `role` + `subject`, heading, summary, tags, tab title). An unknown slug falls back to the only role and says so in a visible note.
- `assets/js/pages/forms.js` — one form engine for both forms (see Decisions). `assets/css/pages/forms.css` — page styles, tokens only.
- Header/footer synced with `npm run sync`; Careers is highlighted on `career.html` and `apply.html`, "Start a project" on `contact.html`. `npm run check`: shell in sync (leftover samples listed are other stages').

### What the OLD pages had (kept identical)
Endpoint: `POST https://api.web3forms.com/submit`, body `FormData`, header `Accept: application/json`, success = `data.success`, network/`success:false` = error. Access key (both forms): `12267171-61e8-4487-ba07-b61e26d734eb`. Honeypot: hidden checkbox `botcheck`.
- **contact** (`#contact-form`): hidden `access_key`, `botcheck`; `name` (text, required), `email` (email, required), `subject` (text), `message` (textarea, required). Button `#contact-submit-btn` disabled + "Sending..." while in flight. Messages `#contact-success` / `#contact-error`. Validation: browser-native only.
- **apply** (`#apply-form`): hidden `access_key`, `subject` = "New Application: Marketing & Presentation Intern", `role` = "Marketing & Presentation Intern", `botcheck`; `name` (text, required), `email` (email, required), `phone` (tel), `portfolio` (url), `message` (textarea, required, "Why this role?"), `resume_link` (url). Button `#apply-submit-btn` ("Submitting..."). Messages `#apply-success` / `#apply-error`. Validation: native only.
- **No file inputs exist on the old apply page** (the CV is a link field), so none were added. The brief's "file inputs unchanged" is therefore moot.
- **career**: one role, "Marketing & Presentation Intern" — tags "Hybrid — Remote & Rajshahi", "Internship", "Path to Full-Time"; link to `apply.html`; `mailto:ariblabib360@gmail.com` for other roles.

### Test results (headless Chrome 1440 / 768 / 360)
61 checks, all passing (script was run from the scratchpad, not committed):
- No horizontal scroll and no console errors on all three pages at all three widths (the only network 404 in a browser is `/favicon.ico` — an S7 item).
- Validation: empty submit sends nothing, shows one inline error per field, focus goes to the first bad field, errors linked with `aria-describedby` + `aria-invalid`, a `role="alert"` summary, errors clear while typing.
- Send, **with Web3Forms mocked** (nothing reached your inbox): POST, `Accept: application/json`, multipart body, access key unchanged, every old field name present, button disabled + "Sending…" and form `aria-busy` while in flight, original success copy, form reset, button restored. `success:false` and a network failure both show the original error copy plus the email address, and keep what was typed.
- Career → Apply link carries the slug; role/subject hidden fields pre-filled and survive `form.reset()`.
- Keyboard: tab order is chips → name → email → subject → budget → message → send; arrow keys move through the project types; visible focus ring.
- **Not done:** a real submission to Web3Forms. Please send one test message from each form once it is live on the real domain.

## Changed
- `career.html`, `apply.html`, `contact.html` (rebuilt on the new shell; Tailwind CDN, Google fonts, Material Symbols and the glow/blob styling are gone)
- `assets/css/pages/forms.css`, `assets/js/pages/forms.js` (new)
- `ledger/S6-careers-contact.md`

## Decisions
- **Field names, ids, access key, endpoint, honeypot and the owner's success/error wording are unchanged.** New optional fields only: `project_type` (radios: Website, App, SaaS, AI/LLM, Research, Not sure) and `budget` (free text — no invented price tiers, any currency). `budget` is dropped from the request when empty.
- The forms now have `action`/`method` pointing at Web3Forms, so without JavaScript they still post (Web3Forms' own thank-you page). With JS, `novalidate` is set and `forms.js` validates; messages live in `data-required` / `data-ok` / `data-err` on the HTML, not in the script.
- **Contact subject:** if left blank, the request sends "New project enquiry — <type>" instead of an empty subject, so notification emails are easier to scan. The visible field is never rewritten.
- **Links:** a link typed without a scheme (`behance.net/me`) is sent as `https://behance.net/me`; the old native check would have rejected it.
- **Email:** `NEXT.site.email` feeds every `[data-site-email]` link; the static address in the HTML is the no-JS fallback.
- **Roles live in two places** until a data file exists: an `<li class="role">` in `career.html` and an entry in `NEXT.roles` at the top of `forms.js` (apply reads it). I did not invent any role, requirement or hiring process; the "What to send" list only restates what the form asks for.
- Copy that is mine (please read): the contact lede, the four "What to tell us" lines, the † note, the career headline "Come build what's next.", "Each role opens its own application." and the closing CTA "Want to see how we work first?". "Next INC." in the role text was changed to "Next Inc." to match the new brand styling.
- Used `.pick` for the project-type chips (work.css already uses `.chip` for status pills).

## Left to do
- One real test submission per form on the live domain.
- Confirm the public email (`ariblabib360@gmail.com`) is the address you want on the site (launch blocker 5) and restrict the access key to the production domain in the Web3Forms dashboard (launch blocker 4).
- Add roles as they open (both places above).

## Requests
- **S1/S7:** promote roles into `assets/data/roles.js` (`{slug, title, summary, text, tags}`) so `career.html` and `apply.html` render from one list; then remove `NEXT.roles` from `forms.js`.
- **S1/S7:** consider promoting `.pick` (radio set), `.letter` (form sheet) and `.field__err` into `site.css` if other pages need forms.
- **S7:** favicon (the only 404 seen in the browser).
