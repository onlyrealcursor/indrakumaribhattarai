# indrabhattarai — portfolio site

Static HTML, CSS and one small JavaScript file. No build step, no framework, no dependencies.
Drag the folder to a host and it works.

```
index.html          Home — hero, selected work, services, about, contact
postme-live.html    Case study
about.html          About
terms.html          Terms of service
privacy.html        Privacy policy
robots.txt · sitemap.xml
assets/css/site.css  the whole design system, one file
assets/js/site.js    one scroll reveal, ~40 lines, nothing else
assets/fonts/        4 self-hosted woff2 faces (112 KB)
assets/img/          11 product screenshots (1280–1600px) + favicon
```

---

## Deploy in two minutes

**Vercel.** [vercel.com/new](https://vercel.com/new) → drag this `site` folder onto the drop zone.
You get a `something.vercel.app` URL immediately. No config, no framework preset.

**Netlify.** [app.netlify.com/drop](https://app.netlify.com/drop) — same, drag the folder.

**GitHub Pages.** Push the contents to a repo, then Settings → Pages → deploy from `main`, root.

---

## Three things before you send the link to Payoneer

**1 · Replace the placeholder URL.** All five pages carry `https://indrakumaribhattarai.vercel.app/` in
their canonical and Open Graph tags, plus `sitemap.xml` and `robots.txt`. Find-and-replace it with
your real URL once the site is live.

**2 · Add a photo.** Save a 4:5 portrait, at least 680 × 850, as `assets/img/portrait.jpg`, then in
`index.html` and `about.html` replace:

```html
<span aria-hidden="true">IB</span>
```

with:

```html
<img src="assets/img/portrait.jpg" width="680" height="850" alt="Indra Kumari Bhattarai">
```

Optional for Payoneer — you already exceed their requirement — but it is the weakest thing on the
page while it is a grey box.

**3 · Read the captions and correct anything untrue.** I opened every screenshot and wrote each
caption from what it actually shows, but you know the project and I do not. Check especially the
*Role* field on the case study, and the line saying your work was the product design and UI/UX.
Narrow it if your actual scope was narrower.

Also worth doing: **ask Outback Yak** before the site goes public. Showing client work is normal
practice and clause 8 of your statement of work grants it — but that agreement is not signed yet.

---

## Why this clears Payoneer

Payoneer publishes an explicit list. From their own help page on the receiving-account
questionnaire:

> Make sure the web site contains **at least 2 of the following**: your first name and last name ·
> your company name shown in your website email address · your phone number · your email address ·
> your primary address that matches the address in your Payoneer profile settings · your picture

**This site carries four of the six, on every page, in the footer:**

| Payoneer wants | On the site |
|---|---|
| First and last name | Indra Kumari Bhattarai — header and footer, all 5 pages |
| Phone number | +977 9767653922 — footer and contact |
| Email address | ecomishanbusiness@gmail.com — footer, contact, about |
| Primary address | Thimi-Biruwa Road, Anantalingeshwar, Madhyapur Thimi 44800 — footer, all 5 pages |
| Your picture | slot ready — add `portrait.jpg` to make it five |

They also require the URL to show *"how your customers find/reach you online, and how you advertise
your product(s)/service(s)"*, and it must not be *"offline or under construction."* Services is its
own ruled section, Contact is its own section on two pages, and every page is finished.

**Connection to the website = `Owner`.** And note their other instruction: *"Please do not submit
your client's website."* Give them **this** URL, not postme.live.

---

## The design system

One CSS file, driven by tokens at the top. Change a token, it lands everywhere.

**Two typefaces, and that is the limit.** Instrument Serif carries every headline — set large,
light, with negative tracking. Geist carries everything else. A third would make it look cheaper,
not richer.

**The page is white.** The only colour is the warm wash behind the hero and whatever comes out of
the product screenshots. If you add a brand colour later, add it as one token and use it twice.

**The craft details, and what each is doing:**

- **The rails** — two hairlines at the container edges, fixed to the viewport. They make the page
  feel drawn rather than typed. Hidden below 820px, where they have no room to read as structure.
- **Crop marks** — small plus signs where a section rule meets a rail. Decorative, `aria-hidden`,
  drawn with gradients so they cost no markup.
- **Graph paper** — an 8.5px grid at 3.8% opacity, drawn with two repeating gradients. No image
  request, and it never blurs at any zoom.
- **The segmented nav** — a lit capsule. The eight-layer inset shadow is what sells it: a highlight
  on the top inner edge, a lift on the bottom, a hairline ring, a whisper of drop shadow.
- **The button** — a gradient body with a bright top edge, a dark bottom edge, and a chip that steps
  forward 2px on hover.
- **The wash** — three overlapping radial sources, not one, so the falloff never reads as a single
  flat circle. Masked with one radial so it fades on both sides and downward at once.

---

## What was verified, not assumed

Measured across all five pages at **twenty viewport widths** (320 → 2560):

- **No horizontal overflow** in any of the **100** page × width combinations
- **No image is ever upscaled** — every screenshot renders at or below its native resolution. The
  hero container is capped at 1280px for exactly this reason; do not widen it without a larger file
- **Zero WCAG AA contrast failures.** Where an element sits on a gradient, a computed-style audit
  cannot read it, so those were **pixel-sampled from a rendered screenshot** instead: the active nav
  pill measures 17.56:1, inactive nav 5.24:1, and the hero eyebrow 7.08:1 against the wash where it
  sits — still 6.05:1 against the most saturated pixel the wash ever reaches
- **Every page**: one `<h1>`, no skipped heading levels, all four landmarks, a skip link, `lang`,
  title and meta description
- **Every image** has descriptive alt text and explicit width/height — no layout shift
- **Every link** has an accessible name; no broken internal links; every in-page anchor resolves
- **Zero console errors**
- **Content can never stay hidden.** The reveal only arms itself when it can also disarm itself, and
  uses a rAF-throttled sweep rather than IntersectionObserver — which was observed skipping elements
  during fast scrolling. Verified with JavaScript off, with `prefers-reduced-motion` set, and after
  jumping straight to the bottom: nothing on screen is ever less than fully opaque
- Touch targets are 34px on coarse pointers

**First view: 186 KB over the wire, 9 requests.** The other ten screenshots lazy-load below the
fold. The reference site this was benchmarked against loads 2,036 KB across 74 requests, has zero
landmarks, three `<h1>`s, seventeen images with empty alt text, and no reduced-motion handling.

---

## Editing it

`site.css` is ordered: faces → tokens → reset → type → layout → masthead → hero → buttons → work →
services → about → contact → footer → case study → legal → touch/print. Section comments say what
each block is for and why.

**Cache busting is manual.** The stylesheet and script are referenced with a content-hash query
(`site.css?v=…`). If you edit either file, update that hash in all five pages, or a returning
visitor may be served the old one — this genuinely bit us mid-build and cost an hour of chasing a
bug that was not there.

Adding a second case study: copy `postme-live.html`, change the content, then add another
`.piece__head` plus `.card` block inside the Selected work section of `index.html`.
