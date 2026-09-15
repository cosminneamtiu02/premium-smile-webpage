# TOKEN_AUDIT.md

**Legacy source audited:** `example/` (read-only) — `tokens.css`, `Home Page.html`, 5 product `.jsx` components, `Publio-Regular.ttf`, 2 screenshots.
**Assumption:** this folder is the legacy design source. It is the only React+CSS artifact set on the machine that is not the current app, and it appears identically in four locations (this repo, `premium-smile-webpage-backup`, and two copies in `~/Downloads`). Nothing in the legacy tree was modified.
**Excluded from brand analysis:** `example/design-canvas.jsx` — a Figma-style canvas wrapper (post-it yellow `#FEF4A8`, warm grey `#F0EEE9`, orange `#C96442`). Tooling chrome, not product. Listed in §5 so its colors are never mistaken for brand.

**Three findings that drive everything below:**
1. The legacy font **cannot render Romanian** — `Ș ș Ț ț` and `Ă ă` are all absent from the file.
2. **12 of 22** observed text/background pairs fail WCAG 2.2 AA, including the primary "Book Now" button label.
3. The CTA color was **green `#00A968`**, later "redirected to accent purple" — so today the CTA is not unique to CTAs.

---

## 1. Extraction Inventory

### 1.1 Colors — product code only

26 distinct colors across 112 occurrences. Alpha variants are folded into the base hex and listed separately.

| Hex | Count | Roles | Alphas seen | Representative paths |
|---|---:|---|---|---|
| `#8377A3` | 27 | background, text/icon, border, shadow | .15 .18 .2 .3 .32 .35 .4 .5 | [tokens.css:28](example/tokens.css#L28), [tokens.css:116](example/tokens.css#L116), [team-section.jsx:10](example/premium-smile%20(1)/components/team-section.jsx#L10) |
| `#FFFFFF` | 20 | background, text/icon, border, shadow, gradient | .1 .5 .85 .86 .92 .95 .96 | [tokens.css:30](example/tokens.css#L30), [composites.jsx:92](example/premium-smile%20(1)/components/composites.jsx#L92) |
| `#2D2341` | 6 | shadow only | .04 .06 .08 .1 .12 | [tokens.css:86-90](example/tokens.css#L86-L90) |
| `#1C1A22` | 6 | background, text, border | .06 .7 .85 | [tokens.css:140](example/tokens.css#L140), [Home Page.html:17](example/Home%20Page.html#L17) |
| `#E5E4EC` | 5 | background, gradient | — | [tokens.css:106](example/tokens.css#L106), [team-section.jsx:80](example/premium-smile%20(1)/components/team-section.jsx#L80) |
| `#6C608E` | 5 | background, text, border | — | [tokens.css:29](example/tokens.css#L29), [tokens.css:148](example/tokens.css#L148) |
| `#140F1E` | 5 | shadow, gradient overlay | .05 .22 .35 .4 | [composites.jsx:300](example/premium-smile%20(1)/components/composites.jsx#L300) |
| `#8875B4` | 4 | text/icon, focus ring | — | [tokens.css:118](example/tokens.css#L118), [team-section.jsx:114](example/premium-smile%20(1)/components/team-section.jsx#L114) |
| `#CCC6DF` | 4 | border, gradient | — | [tokens.css:113](example/tokens.css#L113), [composites.jsx:292](example/premium-smile%20(1)/components/composites.jsx#L292) |
| `#A098B4` | 3 | gradient, background | — | [tokens.css:20](example/tokens.css#L20), [team-section.jsx:56](example/premium-smile%20(1)/components/team-section.jsx#L56) |
| `#F9F8FA` | 3 | background | — | [tokens.css:104](example/tokens.css#L104) |
| `#919297` | 3 | text | — | [tokens.css:110](example/tokens.css#L110), [team-section.jsx:130](example/premium-smile%20(1)/components/team-section.jsx#L130) |
| `#2D263C` | 3 | background, text, border | .08 | [tokens.css:109](example/tokens.css#L109) |
| `#F3F2F6` | 3 | background | — | [tokens.css:137](example/tokens.css#L137), [Home Page.html:15](example/Home%20Page.html#L15) |
| `#B3324A` | 2 | danger text | — | [tokens.css:122](example/tokens.css#L122) |
| `#EEEBF4` | 2 | accent-soft background | — | [tokens.css:149](example/tokens.css#L149), [Home Page.html:23](example/Home%20Page.html#L23) |
| `#281E3C` | 2 | placeholder text, gradient | .4 .5 | [composites.jsx:295](example/premium-smile%20(1)/components/composites.jsx#L295) |
| `#807898` | 1 | brand ramp entry (declared, never consumed) | — | [tokens.css:17](example/tokens.css#L17) |
| `#B1B1B5` | 1 | brand ramp entry (declared, never consumed) | — | [tokens.css:25](example/tokens.css#L25) |
| `#D4AF37` | 1 | review-star fill | — | [tokens.css:32](example/tokens.css#L32) |
| `#6E6E76` | 1 | muted text (light theme) | — | [tokens.css:141](example/tokens.css#L141) |
| `#E1DEE8` | 1 | border (light theme) | — | [tokens.css:143](example/tokens.css#L143) |
| `#6E6E78` | 1 | muted text (Home Page override) | — | [Home Page.html:18](example/Home%20Page.html#L18) |
| `#E4E2EA` | 1 | border (Home Page override) | — | [Home Page.html:19](example/Home%20Page.html#L19) |
| `#3C3228` | 1 | mono label text | .6 | [Home Page.html:40](example/Home%20Page.html#L40) |
| `#000000` | 1 | text-shadow | .35 | [composites.jsx:263](example/premium-smile%20(1)/components/composites.jsx#L263) |

**Brand asset evidence (not in source):** the screenshot [uploads/Screenshot from 2026-04-25 20-54-27.png](example/premium-smile%20(2)/uploads/Screenshot%20from%202026-04-25%2020-54-27.png) shows a **green "Book Now" button, `#00A968`** (1256 px, hue 157°, the dominant chromatic color in the image). This color appears **nowhere** in the CSS or JSX. Corroborating evidence that `#8377A3` is the canonical brand purple: the testimonial avatar CDN URLs hardcode `backgroundColor=8377a3` ([stagger-testimonials.jsx:10-19](example/premium-smile%20(1)/components/stagger-testimonials.jsx#L10-L19)).

There is **no logo file and no favicon** in the legacy tree. The mark is an inline SVG tooth path using `currentColor` ([primitives.jsx:251-255](example/premium-smile%20(1)/components/primitives.jsx#L251-L255)), so it carries no color of its own. Brand color therefore **cannot be confirmed from a logo asset** — see Open Question 3.

### 1.2 Near-duplicate clusters

| Anchor | Total | Members |
|---|---:|---|
| `#8377A3` | 32 | `#8377A3`×27, `#8875B4`×4, `#807898`×1 |
| `#FFFFFF` | 26 | `#FFFFFF`×20, `#F9F8FA`×3, `#F3F2F6`×3 |
| `#2D2341` | 11 | `#2D2341`×6, `#2D263C`×3, `#281E3C`×2 |
| `#1C1A22` | 11 | `#1C1A22`×6, `#140F1E`×5 |
| `#E5E4EC` | 9 | `#E5E4EC`×5, `#EEEBF4`×2, `#E1DEE8`×1, `#E4E2EA`×1 |
| `#6E6E76` | 2 | `#6E6E76`×1, `#6E6E78`×1 |

The last pair differs by **2/255 in one channel** — visually identical, and they exist only because [Home Page.html:18](example/Home%20Page.html#L18) redeclares what [tokens.css:141](example/tokens.css#L141) already defined.

### 1.3 Typography

**Family:** `Publio` (`--font-display` and `--font-body` are the same value — [tokens.css:35-36](example/tokens.css#L35-L36)), fallback `Georgia, serif`. Self-hosted via `@font-face` from a relative path ([tokens.css:7-13](example/tokens.css#L7-L13)).

Direct binary inspection of [Publio-Regular.ttf](example/premium-smile/assets/fonts/Publio-Regular.ttf) (32,680 bytes, identical MD5 in both copies):

| Property | Value |
|---|---|
| Internal name | `PublioW01-Regular` / "Publio W01 Regular" |
| Foundry | Dusan Jelesijevic & Tour de Force Font Foundry |
| License | Commercial EULA (`tourdefonts.com/eula/TDF_eula.pdf`) |
| Glyph count | 220 |
| Mapped codepoints | 256 |
| Variable font (`fvar`) | **No** — static |
| Weights available | **1** (`usWeightClass` 400) |

**Language coverage — the blocking result:**

| Group | Result | Missing |
|---|---|---|
| Romanian comma-below | **FAIL 0/4** | `Ș` U+0218, `ș` U+0219, `Ț` U+021A, `ț` U+021B |
| Romanian cedilla fallback | **FAIL 0/4** | `Ş` U+015E, `ş` U+015F, `Ţ` U+0162, `ţ` U+0163 |
| Romanian breve/circumflex | **FAIL 4/6** | `Ă` U+0102, `ă` U+0103 |
| German | FAIL 7/8 | `ẞ` U+1E9E (capital eszett) |
| French | PASS 17/17 | — |
| Italian | PASS 6/6 | — |
| Latin Extended-A block | 8 / 128 | — |

Romanian is the site's first language and `ă` is one of its most frequent letters. Every fallback path is also absent, so the browser would substitute Georgia mid-word. **The legacy font cannot ship.**

**Fonts loaded from a CDN — all flagged:**
- `JetBrains Mono` from `fonts.googleapis.com` ([Home Page.html:8-10](example/Home%20Page.html#L8-L10)) — used for every eyebrow/micro-label via `--font-mono` ([tokens.css:37](example/tokens.css#L37)).
- React, ReactDOM, Babel from `unpkg.com` ([Home Page.html:56-58](example/Home%20Page.html#L56-L58)).
- Avatar images from `api.dicebear.com` ([stagger-testimonials.jsx:10-19](example/premium-smile%20(1)/components/stagger-testimonials.jsx#L10-L19)).

**Sizes** — declared scale ([tokens.css:39-49](example/tokens.css#L39-L49)), root size is browser default 16px (never overridden):

| Token | rem | px | Token | rem | px |
|---|---|---|---|---|---|
| `--text-2xs` | 0.6875 | 11 | `--text-xl` | 1.75 | 28 |
| `--text-xs` | 0.75 | 12 | `--text-2xl` | 2.25 | 36 |
| `--text-sm` | 0.875 | 14 | `--text-3xl` | 3 | 48 |
| `--text-base` | 1 | **16** | `--text-4xl` | 4 | 64 |
| `--text-md` | 1.125 | 18 | `--text-5xl` | 5.25 | 84 |
| `--text-lg` | 1.375 | 22 | | | |

Body base is **1rem / 16px** — below the required 1.125rem. Off-scale literals bypassing the tokens: `0.95rem` ([composites.jsx:265](example/premium-smile%20(1)/components/composites.jsx#L265)), `1.875rem`, `3.75rem`, `4.5rem` ([team-section.jsx:120,237](example/premium-smile%20(1)/components/team-section.jsx#L120)) — the last three exist in no token.

**Weights:** only `400` (×9) and `600` (×2). The `600` uses at [team-section.jsx:45](example/premium-smile%20(1)/components/team-section.jsx#L45) and [:113](example/premium-smile%20(1)/components/team-section.jsx#L113) have **no corresponding font file**, so the browser synthesizes faux-bold.

**Line-heights:** 1.05, 1.1 (×3), 1.25, 1.5, 1.6, 1.7 (×2). The 1.6 at [Home Page.html:39](example/Home%20Page.html#L39) is a one-off duplicating `--leading-relaxed` 1.7.

**Letter-spacing (em):** −0.04, −0.02 (×2), 0, 0.04 (×5), 0.08, 0.12 (×2), 0.18 (×3). The 0.08 and 0.12 are off-token one-offs.

**text-transform:** `uppercase` on all eyebrows/micro-labels ([primitives.jsx:117](example/premium-smile%20(1)/components/primitives.jsx#L117), [tokens.css:303](example/tokens.css#L303), [team-section.jsx:113,238](example/premium-smile%20(1)/components/team-section.jsx#L113)) — always paired with wide tracking and the mono family.

`text-align: justify` appears 3× on body prose ([home-page.jsx:58](example/premium-smile%20(1)/components/home-page.jsx#L58), [team-section.jsx:129](example/premium-smile%20(1)/components/team-section.jsx#L129), [stagger-testimonials.jsx:179](example/premium-smile%20(1)/components/stagger-testimonials.jsx#L179)). Justified text without hyphenation creates uneven word spacing — a readability problem for the older audience.

### 1.4 Spacing

Declared scale is 4px-based, in **px not rem** ([tokens.css:71-83](example/tokens.css#L71-L83)): 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128.

Histogram of literal spacing values in use:

| px | Count | px | Count | px | Count |
|---|---:|---|---:|---|---:|
| 0 | 10 | 12 | 4 | 32 | 2 |
| 2 | 4 | 16 | 5 | 40 | 1 |
| 4 | 2 | 20 | 2 | 48 | 1 |
| 6 | 1 | 24 | 3 | 64 | 1 |
| 8 | 6 | 28 | 1 | 80 | 1 |
| 10 | 1 | | | 96 | 1 |
| | | | | 128 | 1 |

**41 of 47 occurrences (87.2%) fall on the 4px grid.** Off-grid: `2px`×4, `6px`×1, `10px`×1.

Additional off-grid module constants in [team-section.jsx:11-14](example/premium-smile%20(1)/components/team-section.jsx#L11-L14): `INSET=24`, `LINE_W=6`, `GAP=56`, `OVERHANG=32`.

Section rhythm is expressed three different ways: `clamp(72px, 9vw, 120px)` ([home-page.jsx:31](example/premium-smile%20(1)/components/home-page.jsx#L31)), `clamp(48px, 6vw, 96px)` ([home-page.jsx:47](example/premium-smile%20(1)/components/home-page.jsx#L47)), and plain `96/80` ([team-section.jsx:227](example/premium-smile%20(1)/components/team-section.jsx#L227)).

### 1.5 Radii, shadows, z-index

**Radii** ([tokens.css:63-68](example/tokens.css#L63-L68)): `xs 4`, `sm 6`, `md 10`, `lg 16`, `xl 24`, `pill 999`. The `sm: 6px` carries the comment *"default per user pick"* — a deliberate decision. Hardcoded bypasses: `16` and `12` at [team-section.jsx:79,96](example/premium-smile%20(1)/components/team-section.jsx#L79).

**Shadows** ([tokens.css:86-90](example/tokens.css#L86-L90)) — all built on a single ink `rgba(45,35,65,α)`:

| Token | Value |
|---|---|
| `--shadow-xs` | `0 1px 2px rgba(45,35,65,.04)` |
| `--shadow-sm` | `0 2px 8px rgba(45,35,65,.06)` |
| `--shadow-md` | `0 8px 24px rgba(45,35,65,.08)` |
| `--shadow-lg` | `0 18px 48px rgba(45,35,65,.12)` |
| `--shadow-pill` | `0 6px 22px rgba(45,35,65,.10), 0 1px 3px rgba(45,35,65,.06)` |

Five further shadows are hardcoded off-token, all switching the ink to purple: `0 8px 22px rgba(131,119,163,.32)` ([tokens.css:199](example/tokens.css#L199)), `0 8px 22px rgba(131,119,163,.4)` ([primitives.jsx:184](example/premium-smile%20(1)/components/primitives.jsx#L184)), `0 12px 32px …(.5)` ([tokens.css:361](example/tokens.css#L361)), `0 4px 20px -8px rgba(131,119,163,.15)` and `0 6px 18px -6px rgba(131,119,163,.35)` ([team-section.jsx:81,97](example/premium-smile%20(1)/components/team-section.jsx#L81)).

**z-index:** `1`×6, `2`×1, `3`×2, `4`×2, `49`×1, `50`×1 — plus a *computed* range of 5–10 for testimonial cards (`z = 10 - Math.abs(position)`, [stagger-testimonials.jsx:125](example/premium-smile%20(1)/components/stagger-testimonials.jsx#L125)). The `49`/`50` pair ([composites.jsx:76,173](example/premium-smile%20(1)/components/composites.jsx#L76)) is an ad-hoc nav/panel pairing with no named ladder. There is **no modal or backdrop layer** in the legacy code.

### 1.6 Media queries and breakpoints

The legacy site has **almost no media queries**. Only two `@`-rules exist:
- `@container (max-width: 520px)` ([tokens.css:321](example/tokens.css#L321)) — a *container* query, not a media query.
- `@media (prefers-reduced-motion: reduce)` ([tokens.css:379](example/tokens.css#L379)).

All responsive behavior is JavaScript comparisons against a `ResizeObserver` width:

| Value | Where |
|---|---|
| 520 | [composites.jsx:207](example/premium-smile%20(1)/components/composites.jsx#L207), [home-page.jsx:13](example/premium-smile%20(1)/components/home-page.jsx#L13), [stagger-testimonials.jsx:39](example/premium-smile%20(1)/components/stagger-testimonials.jsx#L39), [tokens.css:321](example/tokens.css#L321) |
| 768 | [composites.jsx:37,41](example/premium-smile%20(1)/components/composites.jsx#L37), [team-section.jsx:224](example/premium-smile%20(1)/components/team-section.jsx#L224) |
| 900 | [home-page.jsx:14](example/premium-smile%20(1)/components/home-page.jsx#L14) |
| 1024 | [team-section.jsx:223,224](example/premium-smile%20(1)/components/team-section.jsx#L223) |

The artboard widths 1440 / 1280 / 834 / 390 ([Home Page.html:69-72](example/Home%20Page.html#L69-L72)) are **canvas preview sizes, not breakpoints** — do not mistake them for either.

**Container max-widths:** 448, 520, 540, 640, 720, 768, 880, 1024, **1240**, 1360. `Container` defines `sm 640 / md 880 / lg 1240 / xl 1360` ([primitives.jsx:18](example/premium-smile%20(1)/components/primitives.jsx#L18)) while `NavBar` hardcodes `1240` twice ([composites.jsx:84,167](example/premium-smile%20(1)/components/composites.jsx#L84)).

### 1.7 Motion

| Duration | Count | Source |
|---|---:|---|
| 160ms (`--dur-fast`) | 2 | [tokens.css:95](example/tokens.css#L95) |
| 240ms (`--dur-base`) | 9 | [tokens.css:96](example/tokens.css#L96) |
| 500ms (`--dur-slow`) | 6 | [tokens.css:97](example/tokens.css#L97) |
| 1200ms | 1 | [composites.jsx:260](example/premium-smile%20(1)/components/composites.jsx#L260) |
| 1400ms | 1 | [composites.jsx:298](example/premium-smile%20(1)/components/composites.jsx#L298) |

Plus a 5500ms hero autoplay interval ([composites.jsx:204](example/premium-smile%20(1)/components/composites.jsx#L204)).

| Easing | Count | Source |
|---|---:|---|
| `cubic-bezier(.2,.7,.3,1)` (`--ease-out`) | 10 | [tokens.css:93](example/tokens.css#L93) |
| `cubic-bezier(.65,0,.35,1)` (`--ease-in-out`) | 1 | [tokens.css:94](example/tokens.css#L94) |
| `cubic-bezier(0.16,1,0.3,1)` | 1 | [team-section.jsx:85](example/premium-smile%20(1)/components/team-section.jsx#L85) — off-token |
| literal `ease-in-out` | 3 | [stagger-testimonials.jsx:158](example/premium-smile%20(1)/components/stagger-testimonials.jsx#L158) — off-token |

`prefers-reduced-motion` is correctly honored ([tokens.css:379-385](example/tokens.css#L379-L385)). Worth carrying over.

### 1.8 Dark mode

**None.** Two themes exist — `lavender` (default) and `light` ([tokens.css:103](example/tokens.css#L103), [:134](example/tokens.css#L134)) — and both are light. `--bg-inverse` (`#2D263C` / `#1C1A22`) and a `Card tone="inverse"` variant ([primitives.jsx:206](example/premium-smile%20(1)/components/primitives.jsx#L206)) provide dark *surfaces*, but no dark *mode*. Nothing to port; **out of scope for v1** as specified.

---

## 2. Analysis

### 2.1 Consolidation map

| Cluster | Survivor | Reasoning |
|---|---|---|
| `#8377A3` ×27, `#8875B4` ×4, `#807898` ×1 (+ `#6C608E` hover) | **One purple ramp anchored at `#8377A3`** | 27 of 32 uses are the anchor, and it is independently confirmed by the dicebear URLs. `#8875B4` and `#807898` are hue-drifted twins serving no distinct role — `#8875B4` is simultaneously "hover" in one theme and "focus ring" in another, which is a bug, not an intent. `#6C608E` becomes the ramp's dark step. |
| `#FFFFFF` ×20, `#F9F8FA` ×3, `#F3F2F6` ×3 | **`#FFFFFF` page + one surface step** | Three near-whites separated by ≤6/255 exist only because two themes and one HTML override each picked their own. One background + one surface is sufficient. |
| `#E5E4EC`, `#EEEBF4`, `#E1DEE8`, `#E4E2EA` | **`#EEEBF4` (tinted soft) + one neutral border step** | Four values within RGB distance 26 doing two different jobs — a lavender fill and a grey border. Split by role, not by drift. |
| `#2D2341`, `#2D263C`, `#281E3C` | **One shadow ink + one text dark** | `#2D2341` is shadow-only; `#2D263C` is text-only. They were never the same thing and should not share a token. |
| `#1C1A22` ×6, `#140F1E` ×5 | **`#1C1A22` for text, `#140F1E` kept as image-overlay ink** | Genuinely different jobs: one is type color, the other is a photo scrim. |
| `#919297`, `#6E6E76`, `#6E6E78` | **One neutral ramp step** | `#6E6E76` vs `#6E6E78` differ by 2/255 — pure copy-paste drift. `#919297` is the same role but too light to pass AA (see 2.2). |
| `#D4AF37` gold | **Keep as a dedicated star/rating token** | Only 1 occurrence, but semantically irreplaceable — review stars are a distinct role. Needs darkening. |
| `#00A968` green | **Promote to the CTA color** | Zero occurrences in code but dominant in the rendered screenshot. See 2.3. |

### 2.2 Contrast matrix — observed legacy pairs

Computed with the WCAG 2.2 relative-luminance formula. **12 of 22 fail.**

| Ratio | Req | Verdict | Pair | Location |
|---:|---:|---|---|---|
| 13.64 | 4.5 | PASS | body text `#2D263C` on `#F9F8FA` | [tokens.css:109](example/tokens.css#L109) |
| 17.21 | 4.5 | PASS | body text `#1C1A22` on `#FFFFFF` | [tokens.css:140](example/tokens.css#L140) |
| **2.93** | 4.5 | **FAIL** | muted text `#919297` on `#F9F8FA` | [tokens.css:110](example/tokens.css#L110) |
| 5.05 | 4.5 | PASS | muted text `#6E6E76` on `#FFFFFF` | [tokens.css:141](example/tokens.css#L141) |
| 5.04 | 4.5 | PASS | muted text `#6E6E78` on `#FFFFFF` | [Home Page.html:18](example/Home%20Page.html#L18) |
| **3.86** | 4.5 | **FAIL** | accent link `#8377A3` on `#F9F8FA` | [tokens.css:116](example/tokens.css#L116) |
| **3.47** | 4.5 | **FAIL** | accent text on soft pill `#EEEBF4` | [Home Page.html:41](example/Home%20Page.html#L41) |
| **4.09** | 4.5 | **FAIL** | **white button label on `#8377A3`** | [primitives.jsx:180-181](example/premium-smile%20(1)/components/primitives.jsx#L180-L181) |
| **4.00** | 4.5 | **FAIL** | white label on hover `#8875B4` | [tokens.css:118](example/tokens.css#L118) |
| 5.67 | 4.5 | PASS | white label on hover `#6C608E` | [tokens.css:148](example/tokens.css#L148) |
| **2.46** | 4.5 | **FAIL** | team bio `#919297` on card `#E5E4EC` | [team-section.jsx:130](example/premium-smile%20(1)/components/team-section.jsx#L130) |
| 3.24 | 3.0 | PASS | doctor name (36px, large) on card | [team-section.jsx:122](example/premium-smile%20(1)/components/team-section.jsx#L122) |
| **3.17** | 4.5 | **FAIL** | role eyebrow 12–14px `#8875B4` on card | [team-section.jsx:114](example/premium-smile%20(1)/components/team-section.jsx#L114) |
| **3.24** | 4.5 | **FAIL** | inline bold accent on card | [team-section.jsx:45](example/premium-smile%20(1)/components/team-section.jsx#L45) |
| **3.11** | 4.5 | **FAIL** | testimonial quote `#919297` on `#FFFFFF` | [stagger-testimonials.jsx:179](example/premium-smile%20(1)/components/stagger-testimonials.jsx#L179) |
| 12.26 | 4.5 | PASS | quote on center card `#EEEBF4` | [stagger-testimonials.jsx:131](example/premium-smile%20(1)/components/stagger-testimonials.jsx#L131) |
| **2.10** | 3.0 | **FAIL** | gold stars `#D4AF37` on white (UI) | [tokens.css:32](example/tokens.css#L32) |
| 5.71 | 4.5 | PASS | danger `#B3324A` on `#F9F8FA` | [tokens.css:122](example/tokens.css#L122) |
| **3.05** | 4.5 | **FAIL** | white label on green CTA `#00A968` | screenshot |
| 3.78 | 3.0 | PASS | focus ring `#8875B4` on `#F9F8FA` (UI) | [tokens.css:121](example/tokens.css#L121) |
| 4.09 | 3.0 | PASS | focus ring `#8377A3` on white (UI) | [tokens.css:151](example/tokens.css#L151) |
| **1.56** | 3.0 | **FAIL** | border `#CCC6DF` on `#F9F8FA` (UI) | [tokens.css:113](example/tokens.css#L113) |

**Hero text is the worst case and is separate.** White headline over the placeholder gradient plus its scrim ([composites.jsx:292-300](example/premium-smile%20(1)/components/composites.jsx#L292-L300)) computes to:

| Composite background | Ratio | Verdict |
|---|---:|---|
| `#B7B5BF` (22% scrim, top) | 2.02 | FAIL |
| `#DBD9E2` (5% scrim at the 35% stop) | **1.39** | FAIL |
| `#918F9A` (40% scrim, bottom) | 3.19 | FAIL |

Over **real photography** this is genuinely indeterminate — it depends on the image, and no photography exists in the legacy tree. Only the placeholder was computable. What is determinate: the current scrim is too weak to guarantee any floor, so the rebuild needs a minimum-contrast scrim or a text plate rather than a decorative gradient.

### 2.3 Signal vs noise

**Signal — deliberate brand identity:**
- The purple hue family around `#8377A3`. It is 27 of 112 color occurrences, spans every role, and is independently hardcoded into avatar URLs. This is the brand.
- `--radius-sm: 6px` annotated *"default per user pick (rx=6 in svg)"* — an explicit human decision, and the set 4/6/10/16/24 is a coherent soft-but-not-round progression.
- A single shadow ink `rgba(45,35,65,α)` across all five elevation levels — a real system, correctly built.
- The mono + uppercase + wide-tracking eyebrow pattern, applied consistently in 5 places.
- `prefers-reduced-motion` support.
- **The green CTA.** The code says `--brand-cta: rgb(131,119,163); /* redirected to accent purple */` ([tokens.css:28](example/tokens.css#L28)), and two component comments still describe a *"green CTA"* ([primitives.jsx:125,166](example/premium-smile%20(1)/components/primitives.jsx#L125)) on what is now a purple button. The screenshot proves green was the shipped state. This is brand intent that was overwritten, not absence of intent.

**Noise — accidental drift:**
- `#6E6E76` vs `#6E6E78`; `#E1DEE8` vs `#E4E2EA` — a redeclaration in [Home Page.html:13-25](example/Home%20Page.html#L13-L25) that forked a third unnamed theme on top of the two real ones.
- `#8875B4` doing hover duty in one theme and focus-ring duty in another.
- `1.875rem` / `3.75rem` / `4.5rem` in team-section, matching no token.
- `font-weight: 600` against a font that ships only 400.
- Radii `12`/`16` and five purple-inked shadows hardcoded past the token layer.
- z-index `49`/`50` chosen by hand; testimonial z computed arithmetically.
- `--brand-purple-900`, `--brand-neutral-300`, `--brand-neutral-500` declared and never consumed.

**Current personality:** soft lavender-on-white, gentle rather than clinical — low-saturation purple, generous 4px-grid spacing, small 6px radii, and slow 240–1400ms crossfades that read spa-like rather than medical. But the execution is *thin*: text sits at 16px with muted greys that fail contrast, and the identity is diluted because the one genuinely distinctive color (the green CTA) was collapsed into the accent purple, leaving a monochrome page where nothing signals "act here."

### 2.4 Hotspots — the top 5 not to carry over

1. **The font.** Cannot render `Ș ș Ț ț` or `Ă ă`, has no cedilla fallback, is not variable, ships one weight, and is under a commercial desktop EULA. Romanian is the primary language. Non-negotiable replacement.
2. **`#919297` as muted text.** Fails at 2.93:1, 3.11:1, and 2.46:1 depending on surface — and it is the color of most secondary prose on the site, including every doctor bio.
3. **The primary button label at 4.09:1.** The most important conversion element on a clinic site fails AA. So does its hover state at 4.00:1.
4. **CTA is not unique.** `--cta` is literally `var(--accent)` ([tokens.css:124-126](example/tokens.css#L124-L126)), so "Book Now" is chromatically identical to every other primary button and to the doctor-name headings.
5. **Three competing sources of truth.** `tokens.css` `:root`, the `[data-theme]` blocks, and the `:root` override inside [Home Page.html:13-25](example/Home%20Page.html#L13-L25) each redefine `--bg`, `--fg`, `--fg-muted`, `--border` and `--accent-soft` with different values — plus `!important` on 20+ lines to fight inline styles ([tokens.css:238-253](example/tokens.css#L238-L253), [:299-318](example/tokens.css#L299-L318)).

---

## 3. Draft `@theme` Proposal

Provenance: **[LEGACY]** taken as-is · **[CORRECTED]** legacy value adjusted for AA (before → after shown) · **[PROPOSED]** no legacy signal existed.

```css
@theme {
  /* ─────────────────────────────────────────────────────────
     PRIMITIVES — raw ramps. Components must never use these.
     ───────────────────────────────────────────────────────── */

  /* Brand purple — hue 256°, anchored on legacy #8377A3 [LEGACY hue] */
  --color-purple-50:  #F7F7F8;
  --color-purple-100: #EFEEF1;
  --color-purple-200: #D9D6E1;
  --color-purple-300: #BCB6CE;
  --color-purple-400: #9B91B5;
  --color-purple-500: #7A6D9C;   /* ≈ legacy #8377A3, one step darker */
  --color-purple-600: #645883;
  --color-purple-700: #51486A;
  --color-purple-800: #3F3852;
  --color-purple-900: #2C273A;
  --color-purple-950: #1D1B22;

  /* Neutral — hue 240°, 3.5% sat (legacy greys carry a faint cool cast) [LEGACY hue] */
  --color-neutral-50:  #F7F7F7;
  --color-neutral-100: #EFEFF0;
  --color-neutral-200: #DADADC;
  --color-neutral-300: #C0C0C4;
  --color-neutral-400: #A0A0A6;
  --color-neutral-500: #808089;
  --color-neutral-600: #6A6A71;
  --color-neutral-700: #56565C;
  --color-neutral-800: #424247;
  --color-neutral-900: #2F2F32;
  --color-neutral-950: #1E1E1F;

  /* CTA green — hue 157°, from the rendered screenshot [LEGACY hue] */
  --color-green-50:  #F3FCF8;
  --color-green-100: #E9F7F1;
  --color-green-500: #00A968;   /* the exact legacy screenshot value */
  --color-green-600: #00975E;
  --color-green-700: #008854;   /* AA-safe against a white label */
  --color-green-800: #007145;
  --color-green-900: #00613C;

  /* ─────────────────────────────────────────────────────────
     SEMANTIC — 18 roles. This is all components may use.
     ───────────────────────────────────────────────────────── */
  --color-background:        #FFFFFF;   /* [LEGACY] tokens.css:135 */
  --color-surface:           #F7F7F7;   /* [CORRECTED] #F9F8FA → #F7F7F7, merges 3 near-whites */
  --color-surface-subtle:    #EFEFF0;   /* [CORRECTED] #F3F2F6 → #EFEFF0 */
  --color-text:              #1C1A22;   /* [LEGACY] tokens.css:140 */
  --color-text-muted:        #6A6A71;   /* [CORRECTED] #919297 (2.93:1) → #6A6A71 (5.37:1) */
  --color-primary:           #51486A;   /* [CORRECTED] #8377A3 (4.09:1 w/ white) → #51486A (8.45:1) */
  --color-primary-hover:     #3F3852;   /* [CORRECTED] #8875B4 (4.00:1) → #3F3852 (11.06:1) */
  --color-primary-soft:      #EEEBF4;   /* [LEGACY] tokens.css:149 — tinted fill */
  --color-primary-text-safe: #51486A;   /* [CORRECTED] #8377A3 (3.86:1) → #51486A (8.45:1) */
  --color-cta:               #008854;   /* [CORRECTED] #00A968 (3.05:1) → #008854 (4.52:1) */
  --color-cta-hover:         #007145;   /* [CORRECTED] darker step, 6.09:1 */
  --color-cta-text:          #FFFFFF;   /* [LEGACY] */
  --color-border:            #DADADC;   /* [CORRECTED] #CCC6DF → #DADADC — decorative only */
  --color-border-strong:     #808089;   /* [PROPOSED] controls/inputs, 3.91:1 */
  --color-focus-ring:        #645883;   /* [CORRECTED] #8875B4 → #645883, 6.43:1 */
  --color-error:             #B3324A;   /* [LEGACY] tokens.css:122, already passes */
  --color-success:           #10695C;   /* [PROPOSED] teal-shifted so CTA green stays unique */
  --color-star:              #B29126;   /* [CORRECTED] #D4AF37 (2.10:1) → #B29126 (3.01:1) */

  /* ── Typography ── */
  /* [PROPOSED] font — legacy Publio cannot render Ș ș Ț ț / Ă ă. Must be
     self-hosted, variable, with full Latin Extended-A. See Open Question 2. */
  --font-sans: "Literata Variable", Georgia, ui-serif, serif;

  --font-weight-regular:  400;   /* [LEGACY] the only weight the old font had */
  --font-weight-medium:   500;   /* [PROPOSED] replaces the faux-bold 600 */
  --font-weight-semibold: 600;   /* [CORRECTED] was synthesized; now a real cut */

  /* Fluid scale. Body ≥ 1.125rem as required (legacy was 1rem). */
  --text-xs:   clamp(0.875rem, 0.85rem + 0.12vw, 0.9375rem);  /* [CORRECTED] 0.6875rem floor was 11px */
  --text-sm:   clamp(1rem,     0.97rem + 0.15vw, 1.0625rem);  /* [CORRECTED] from 0.875rem */
  --text-base: clamp(1.125rem, 1.09rem + 0.18vw, 1.1875rem);  /* [CORRECTED] from 1rem */
  --text-lg:   clamp(1.25rem,  1.19rem + 0.30vw, 1.375rem);   /* [LEGACY] 1.375rem retained */
  --text-xl:   clamp(1.5rem,   1.38rem + 0.60vw, 1.75rem);    /* [LEGACY] 1.75rem retained */
  --text-2xl:  clamp(1.875rem, 1.66rem + 1.05vw, 2.25rem);    /* [LEGACY] 2.25rem retained */
  --text-3xl:  clamp(2.25rem,  1.83rem + 2.10vw, 3rem);       /* [LEGACY] 3rem retained */
  --text-4xl:  clamp(2.75rem,  2.05rem + 3.50vw, 4rem);       /* [CORRECTED] 5.25rem cap was excessive */

  --leading-tight:   1.15;     /* [CORRECTED] from 1.1 — headings for older readers */
  --leading-normal:  1.5;      /* [LEGACY] tokens.css:53 */
  --leading-relaxed: 1.7;      /* [LEGACY] tokens.css:54 */

  --tracking-tight:  -0.02em;  /* [LEGACY] tokens.css:57 */
  --tracking-normal: 0em;      /* [LEGACY] tokens.css:58 */
  --tracking-wide:   0.04em;   /* [LEGACY] tokens.css:59 — 5 uses */
  --tracking-widest: 0.18em;   /* [LEGACY] tokens.css:60 — eyebrow pattern */

  /* ── Layout (semantic additions only; Tailwind spacing/breakpoints untouched) ── */
  --spacing-section:       clamp(3.5rem, 2.5rem + 5vw, 7.5rem);  /* [LEGACY] ≈ clamp(72px,9vw,120px) */
  --spacing-section-tight: clamp(3rem,   2.4rem + 3vw, 6rem);    /* [LEGACY] ≈ clamp(48px,6vw,96px) */
  --width-content: 77.5rem;    /* [LEGACY] 1240px — the de-facto container */
  --width-prose:   48rem;      /* [CORRECTED] 768px, replaces 448/540/640/720/880 drift */

  /* ── Radii [LEGACY] — the 6px "user pick" is preserved as the default ── */
  --radius-xs:   0.25rem;    /* 4px  */
  --radius-sm:   0.375rem;   /* 6px  — default */
  --radius-md:   0.625rem;   /* 10px */
  --radius-lg:   1rem;       /* 16px */
  --radius-xl:   1.5rem;     /* 24px */
  --radius-pill: 62.4375rem;

  /* ── Shadows [LEGACY] — single ink, 3 levels (was 5) ── */
  --shadow-sm: 0 2px 8px rgba(45, 35, 65, 0.06);
  --shadow-md: 0 8px 24px rgba(45, 35, 65, 0.08);
  --shadow-lg: 0 18px 48px rgba(45, 35, 65, 0.12);

  /* ── z-index [PROPOSED] — legacy had only ad-hoc 49/50 ── */
  --z-content:  0;
  --z-header:   100;
  --z-backdrop: 200;
  --z-modal:    300;

  /* ── Motion [LEGACY] tokens.css:93-97 ── */
  --ease-out:      cubic-bezier(0.2, 0.7, 0.3, 1);
  --duration-fast: 160ms;
  --duration-base: 240ms;
}
```

### 3.1 Semantic contrast verification — all pairs pass

| Pair | Ratio | Req | |
|---|---:|---:|---|
| text on background | 17.21 | 4.5 | PASS |
| text on surface | 16.06 | 4.5 | PASS |
| text on surface-subtle | 14.98 | 4.5 | PASS |
| text on primary-soft | 14.61 | 4.5 | PASS |
| text-muted on background | 5.37 | 4.5 | PASS |
| text-muted on surface | 5.01 | 4.5 | PASS |
| text-muted on surface-subtle | 4.67 | 4.5 | PASS |
| primary-text-safe on background | 8.45 | 4.5 | PASS |
| primary-text-safe on surface | 7.89 | 4.5 | PASS |
| primary-text-safe on primary-soft | 7.17 | 4.5 | PASS |
| **cta-text on cta** | **4.52** | 4.5 | **PASS** |
| cta-text on cta-hover | 6.09 | 4.5 | PASS |
| on-primary label on primary | 8.45 | 4.5 | PASS |
| on-primary label on primary-hover | 11.06 | 4.5 | PASS |
| error on background | 6.05 | 4.5 | PASS |
| error on surface | 5.65 | 4.5 | PASS |
| success on background | 6.57 | 4.5 | PASS |
| border-strong on background (UI) | 3.91 | 3.0 | PASS |
| border-strong on surface (UI) | 3.65 | 3.0 | PASS |
| focus-ring on background (UI) | 6.43 | 3.0 | PASS |
| focus-ring on surface (UI) | 6.00 | 3.0 | PASS |
| focus-ring on primary-soft (UI) | 5.46 | 3.0 | PASS |
| cta vs background (UI boundary) | 4.52 | 3.0 | PASS |
| primary vs background (UI boundary) | 8.45 | 3.0 | PASS |

**0 failures across 24 pairs.**

Two deliberate choices worth stating. `--color-border` (`#DADADC`, 1.40:1) is **decorative only** — dividers and card outlines carrying no information; any border delimiting an interactive control must use `--color-border-strong` (3.91:1), which is why both exist. And `--color-success` is teal-shifted rather than green specifically so `--color-cta` remains the only green in the system, satisfying the unique-CTA constraint.

---

## 4. Open Questions

1. **Is the CTA green or purple?** The screenshot and two stale code comments say green `#00A968`; `tokens.css` says it was "redirected to accent purple."
   *(a)* Restore green — satisfies the unique-CTA rule; green/purple is a strong, legible pairing. *(b)* Keep purple — calmer, but the CTA stays indistinguishable from every other button. *(c)* A third hue entirely.
   **Recommendation: (a).** It is the only evidence-backed color that can be unique to CTAs, and the redirect reads as an unfinished edit rather than a decision.

2. **Which replacement font?** Publio is unusable — no `Ș ș Ț ț`, no `Ă ă`, one weight, commercial desktop EULA.
   *(a)* A libre variable serif (Literata, Source Serif 4) — keeps Publio's warm, editorial feel. *(b)* A libre variable sans (Inter, Source Sans 3) — maximum legibility for an older audience. *(c)* License a webfont cut of Publio from Tour de Force, if one exists with Romanian coverage.
   **Recommendation: (a) Literata.** It preserves the spa-like serif personality the legacy site was reaching for, covers all five languages, and is variable and self-hostable.

3. **Is any legacy color emotionally "the brand" to the owner?** `#8377A3` dominates the code, but there is **no logo file and no favicon** anywhere in the legacy tree, so the purple could not be verified against real signage.
   *(a)* Confirm purple from physical signage/print. *(b)* Re-derive from the actual logo once supplied. *(c)* Treat purple as provisional.
   **Recommendation: (b)** — a hue confirmed against real-world collateral beats one inferred from CSS.

4. **Base body size — 1.125rem or 1.25rem?** The proposal uses 1.125rem (the required minimum).
   *(a)* 1.125rem — matches the legacy `--text-md` that already carried the doctor bios. *(b)* 1.25rem — friendlier for 60+ readers, but reflows every layout and shortens line lengths.
   **Recommendation: (a)**, paired with `--leading-relaxed` 1.7 for prose; ship it and re-test with real patients before going bigger.

5. **Radius personality — keep 6px?** `--radius-sm: 6px` is annotated as an explicit user pick.
   *(a)* Keep 6px — modest, slightly clinical. *(b)* Soften to 10–12px — warmer, closer to the stated "premium spa" intent. *(c)* Sharpen to 2–4px — more medical/precise.
   **Recommendation: (a).** It was a deliberate human decision and the one structural choice the legacy code is internally consistent about.

6. **Should the gold star color survive?** `#D4AF37` fails even the 3:1 UI threshold at 2.10:1 and must darken to `#B29126`, which reads more bronze than gold.
   *(a)* Darken to `#B29126`. *(b)* Keep gold but always on a dark chip. *(c)* Drop gold; use `--color-cta` for filled stars.
   **Recommendation: (a).** Ratings must be perceivable; bronze at 3.01:1 is the smallest change that gets there.

7. **How should hero text be guaranteed legible?** Over the current gradient, white text computes as low as 1.39:1, and over real photography it is unpredictable.
   *(a)* Minimum-opacity scrim (≥0.55) behind the text band. *(b)* A solid text plate. *(c)* Move hero copy below the image.
   **Recommendation: (a)** — preserves the look while establishing a hard contrast floor independent of which photo is used.

8. **Do we keep two light themes?** The legacy `lavender` and `light` themes, plus the `Home Page.html` override, are three overlapping sources of truth.
   *(a)* Collapse to one — simplest, and what this proposal assumes. *(b)* Keep lavender as a marketing variant.
   **Recommendation: (a).** No dark mode in v1, and the two light themes differ only by drift, not intent.

9. **Is `justify` text intentional?** It appears on all three long-prose blocks.
   *(a)* Switch to `text-align: start` — better for the older audience, no whitespace rivers. *(b)* Keep justified.
   **Recommendation: (a).**

10. **Does the site need a `success` role at all?** There is zero legacy signal for one, and a static brochure site may have no form feedback.
    *(a)* Keep the teal `#10695C` for a future booking form. *(b)* Drop it and reclaim a semantic slot.
    **Recommendation: (a)** if a contact/booking form ships in v1, otherwise (b).

---

## 5. Evidence Appendix

**Files read (all read-only; nothing in the legacy tree was modified):**

| File | Size | What it contributed |
|---|---:|---|
| [example/tokens.css](example/tokens.css) | 385 lines | Full token layer, both themes, component classes, motion, reduced-motion |
| [example/Home Page.html](example/Home%20Page.html) | 106 lines | Third `:root` override, CDN font/script tags, artboard widths |
| [example/premium-smile (1)/components/primitives.jsx](example/premium-smile%20(1)/components/primitives.jsx) | 268 lines | Container/Heading/Text/Button/BookNowButton/Card/Stars/LogoMark; "green CTA" comments |
| [example/premium-smile (1)/components/composites.jsx](example/premium-smile%20(1)/components/composites.jsx) | 305 lines | NavBar z-index 49/50, hero scrims, crossfade durations |
| [example/premium-smile (1)/components/team-section.jsx](example/premium-smile%20(1)/components/team-section.jsx) | 261 lines | Worst contrast failures, off-token radii/shadows/sizes, faux-bold 600 |
| [example/premium-smile (1)/components/home-page.jsx](example/premium-smile%20(1)/components/home-page.jsx) | 104 lines | Section rhythm clamps, container sizes |
| [example/premium-smile (1)/components/stagger-testimonials.jsx](example/premium-smile%20(1)/components/stagger-testimonials.jsx) | 192 lines | Computed z-index 5–10, dicebear CDN avatars, off-token easing |
| [example/premium-smile/assets/fonts/Publio-Regular.ttf](example/premium-smile/assets/fonts/Publio-Regular.ttf) | 32,680 B | Glyph coverage failure (binary `cmap`/`name`/`OS/2` inspection) |
| [example/premium-smile (2)/uploads/Screenshot from 2026-04-25 20-54-27.png](example/premium-smile%20(2)/uploads/Screenshot%20from%202026-04-25%2020-54-27.png) | 684×188 | Green CTA `#00A968` |
| [example/design-canvas.jsx](example/design-canvas.jsx) | 622 lines | **Excluded** — tooling chrome |

**Excluded tooling palette** (`design-canvas.jsx`, never brand): `#000000` `#181410` `#281E14` `#2A251F` `#3C3228` `#5A4A2A` `#BBBBBB` `#C96442` `#F0EEE9` `#FEF4A8` `#FFFFFF`.

**Method.** Colors, spacing, radii, z-index, type, motion and breakpoints were extracted by regex over the seven product files with per-line role inference, then clustered at RGB distance < 26. Contrast used the WCAG 2.2 relative-luminance formula; corrected values were found by holding hue and saturation constant in HSL and walking lightness in 0.5% steps until the threshold was met. The font was parsed directly from its binary `cmap`, `name`, `OS/2`, `head` and `maxp` tables. The screenshot was decoded from raw PNG scanlines for an exact pixel histogram.

**Explicitly not determined:**
- Hero text contrast over **real** photography — no photography exists in the legacy tree; only the placeholder gradient was computable.
- Brand color against a logo or favicon — **neither exists**; the mark is an inline SVG using `currentColor`.
- Whether `#00A968` was ever committed to source, or only ever existed in the rendered build the screenshot captured.
- Print/signage colors, and any pre-`example/` history of this design.
