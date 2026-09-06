# Mobile and site quality checklist

6 September 2026, draft PR #2. Covers all 20 items in the second screenshot. Source checks are not a substitute for testing the rendered site on a phone.

| # | Item | Work and status |
|---|---|---|
| 1 | Horizontal scrolling | Allow grid/flex children to shrink, wrap long content, reduce oversized tablet heading. No blanket overflow hiding that would conceal content. Rendered viewport check outstanding. |
| 2 | Broken links | Static audit checks local file targets and HTML fragments across 16 content pages. External platform/service availability not guaranteed. |
| 3 | Mobile menu | Existing menu retained; click and Escape handling tested. Footer navigation remains visible. |
| 4 | Favicon | Existing branded favicon retained and linked from root utility/policy/helper pages too. |
| 5 | Page titles | Unique titles checked for 16 content pages. |
| 6 | Meta descriptions | Descriptions present on those pages. |
| 7 | Footer links | Local targets checked; footer wraps. Policies and social controls remain reachable. |
| 8 | Custom 404 | Already added; root-relative links support nested missing paths. Actual HTTP status needs checking after release. |
| 9 | Copyright year | Current 2026 fallback; homepage year updates via JavaScript. Copyright wording is not evidence of image rights. |
| 10 | Image compression | Eight display assets converted to WebP: 1,893,466 bytes down to 318,068 bytes (83.2% smaller in aggregate). Originals retained. Photo longest edge limited to 1280px, small displayed logo to 192px. Share/search icons remain unchanged. Counts are asset totals, not a measured page-load benchmark. |
| 11 | Broken buttons | Existing service-tab, feed, consent and enquiry tests retained; menu interaction test added. Inactive enquiry submission is intentional, clearly explained. |
| 12 | Success messages | Form reports success only after accepted response; next-steps link then becomes available. |
| 13 | Error messages | Network, timeout, CAPTCHA and quota failures retain details and provide guidance; no false receipt claim. |
| 14 | Placeholder copy | Replaced “Preview only” form message with clear public-facing inactive status. Input hint text is useful guidance, not unfinished copy. Legal review notices remain because details are genuinely outstanding. |
| 15 | Unused navigation | Links resolve to existing sections/pages; no empty review/team/case-study sections added. |
| 16 | Mobile overflow | Narrow-screen tabs stack, long labels wrap, footer wraps, consent fieldset can shrink, checkbox sizing fixed. Policy tables scroll within their own labelled region. |
| 17 | Clickable logo | Header/footer brand links already lead home; utility page logos also link home. |
| 18 | Clickable number | Deliberately absent: owner requested old number and WhatsApp removal. Add tel link only after business number chosen. |
| 19 | Clickable email | Existing mailto link only appears with verified active domain mailbox configuration. No invented working email published. |
| 20 | Mobile optimisation | Responsive layout, viewport tags, input font sizing, touch controls, reduced motion, compressed photos and mobile CTA. Real-device layout/zoom/performance testing remains outstanding. |

Run `python scripts/optimise-images.py` to recreate delivery assets using ImageMagick. Image provenance still refers to original files; derivative compression does not resolve licence gaps. IMAGE-OPTIMISATION.json records exact asset sizes.

Release checks: 320/375/390/768/1024px widths, portrait/landscape, large text and 200–400% zoom, keyboard focus visibility around sticky CTA/consent panel, active provider embeds, mobile menu and long form input. No real-browser overflow or Lighthouse performance score is claimed here.
