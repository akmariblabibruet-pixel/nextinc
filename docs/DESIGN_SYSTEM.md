# Design system — "The Monograph"

Live reference: open `/styleguide.html`. Source: `assets/css/site.css` (owned by S1 — do not edit from other stages).

## Rules
1. **Fonts:** CMU Serif for everything; CMU Typewriter Text (`.mono`) for ids, years, tags, code. Never add another typeface.
2. **Colour:** only CSS variables from `:root` (`--paper`, `--ink`, `--crimson`, …). Crimson is for emphasis, never for large text blocks. `--crimson-hi` only on dark.
3. **Dark is for video.** The `.room` band is the screening room. Use it for films (and the footer), not for decoration.
4. **Headings:** put one word in `<em>` per headline — it turns italic crimson. Use `data-split` on the page's H1 for the word-rise.
5. **Corners are 2 px.** Separation comes from hairline rules (`.rule`, `.rule--thick`, `.rule--double`), not shadows or rounded boxes.
6. **Grid:** `.grid` + `.c-N` (span) + `.s-N` (start). Phones stack; add `.m-6` for two-up on phones.
7. **Numbers:** `.num` / tabular figures for anything that is counted. Section marks use `§`, notes use `†`.
8. **Motion:** `data-reveal` (stagger with `style="--d:N"`), `data-split`, `data-count`, `data-parallax`. Never put parallax on a `data-reveal` node.

## Components (all in the style guide)
| Class / hook | Use |
|---|---|
| `.sec`, `.sec--tight`, `.sec-head` | section spacing & the double-ruled section header (§ number, title, intro) |
| `.plate`, `.plate__frame`, `.cap` | a project/figure with crop marks and a caption — create with `NEXT.render.plate(p,{no})` |
| `.cover` | generated art — `NEXT.art.cover({slug,palette,motif})` |
| `.film`, `.reel`, `.room`, `.lightbox` | video card, programme list, dark band, modal player — `data-film="<id>"` opens it |
| `.toc` | table of contents with dotted leaders |
| `.algo` | algorithm block (`data-mount="algo"`) |
| `.disc`, `.tab` | booktabs rows / table |
| `.refs` | numbered references (`data-mount="refs"`) |
| `.authors__line`, `.author` | founders (`data-mount="authors"`) |
| `.stats` | count-up facts row (`data-mount="stats"`) |
| `.runhead` | marquee of disciplines (`data-mount="runhead"`) |
| `.fig-map` | dot-matrix hubs figure (`data-mount="map"`) |
| `.btn`, `.btn--ghost`, `.btn--play`, `.btn--room`, `.link` | actions |
| `.field` | underlined form fields |
| `.page-head`, `.crumbs` | intro block for inner pages |
| `.is-sample` | auto-added when `sample:true` — never style it away |

## Data hooks (assets/data/*.js)
`NEXT.site` (facts, hubs, disciplines, method, stats, marquee) · `NEXT.projects` · `NEXT.films` · `NEXT.recognition` · `NEXT.team`.
Field docs are in each file's header comment.

## Page boilerplate
Copy `work.html` (head, shell markers, script order). Script order is fixed:
`data/site → projects → films → recognition → team → world → js/art → core → render → pages/<page>.js`.
After editing `partials/`, run `npm run sync`.
