# Privacy, accessibility and legal readiness review

Review date: 6 September 2026. Review branch only; not a certification of legal compliance, WCAG conformance or security. No paid service or new framework introduced. GitHub Pages publishing configuration and CNAME preserved. Jotform untouched.

## Checklist and remaining decisions

| Requested area | Implemented / reviewed | Remaining gap and release condition |
|---|---|---|
| Privacy | Separate noindex privacy policy; fields, purposes, candidate lawful bases, providers, rights, contact gap and revision date | **High:** confirm legal controller, monitored email/address, legitimate-interests assessment, retention and processor/transfer arrangements before enabling enquiries |
| Terms | Draft website-use terms; scope/availability agreed, misuse rules, mandatory rights preserved, proposed England/Wales law | **High:** operator identity and fair project terms need review before bookings; no arbitrary liability cap or forced arbitration |
| Cookies | Individual TikTok/Facebook/X/Bluesky choices, all off initially; equal reject/save buttons; footer settings; local preferences expire after 180 days; cross-tab revocation | **High:** source inventory is not a live cookie inventory. Check actual names, domains, purposes and lifetimes for each opted-in provider before release; disable any provider that cannot be adequately disclosed |
| Refunds | Draft cancellation/refund information distinguishes consumer service cancellation, early start, goods/digital and business contracts | **High:** supply contact, model cancellation information and explicit early-start request in the quote workflow; confirm actual commercial terms |
| Form notice | Clear purpose notice, minimised required fields, optional phone/postcode; no marketing subscription | No compulsory blanket consent: pre-contract enquiries may use contract; business-representative/general enquiries need assessed legitimate interests. Keep form inactive until privacy/delivery/security gates pass |
| Scripts/embeds | No analytics, advertising pixels, remote fonts or session replay installed; feeds denied before choice; withdrawal removes frames and aborts API requests; helpers do not load widgets when visited directly | Third parties may track after permission and restrict embeds. Provider script behaviour cannot be guaranteed. Instagram remains a direct profile link |
| Accessibility | Fixed mobile CSS that hid footer navigation; stronger control borders/focus; labelled preference checkboxes and buttons; policy table scroll region; semantic headings/skip links | Manual screen-reader, keyboard, touch, 200–400% zoom, 320px reflow and third-party widget review still needed; no claim of full WCAG 2.1 AA audit |
| Content integrity | Reviewed homepage and eight services; no testimonials, awards, partner badges or invented customer work; scope and availability qualified | Owner must confirm actual deliverable services before accepting projects; drone flights and site work cannot be inferred from planning pages |
| Business details | Dedicated draft page; Hereford/surrounding area and remote UK scope | **High:** legal name, structure, correspondence address, working email; company number/jurisdiction and VAT only if applicable. Do not publish UTR/National Insurance number |
| Copyright | Referenced-asset inventory and known source credits in IMAGE-CREDITS.md; illustrative-photo disclosure | **High:** retained assets and logo ownership/permission need evidence. Copyright notices and filenames do not establish a licence |
| Jurisdiction | UK-first assessment: UK GDPR/DPA, PECR, consumer and trading disclosures | Review ICO fee assessment and actual operator duties. EU GDPR, CCPA/CPRA and Canadian rules need a separate applicability assessment if offering/monitoring or operating there; website visibility alone is not evidence that every regime applies |
| Risk reporting | This versioned report, accessibility results, policy changelog and existing SECURITY.md | Owner/legal review outstanding. No checklist can eliminate legal claims or guarantee security |

## Technical data-flow inventory

- Main document/assets: GitHub Pages, browser connection details. No external font service.
- Local storage `gallis-privacy-v1`: version, timestamp, four booleans. No enquiry fields, passwords, IPs or captcha tokens. Recognised for 180 days, deleted when checked after expiry. Storage failure falls back to current-page choices. Expiry checked each minute for loaded widgets; background browser timer throttling may delay this.
- TikTok: local sandboxed helper, then `www.tiktok.com/embed.js` after permitted parent message. Provider may contact additional domains; audit those in a browser.
- X: local sandboxed helper, then `platform.twitter.com/widgets.js`; `data-dnt=true` is not a guarantee of no tracking. Audit downstream domains.
- Facebook: `www.facebook.com/plugins/page.php` iframe only after permission and explicit loading.
- Bluesky: `public.api.bsky.app` fetch with omitted credentials; whitelisted `cdn.bsky.app` images; five-minute refresh while visible; safe text rendering; no account tokens.
- Instagram: external link only. Opening any profile voluntarily leaves this site's controls.
- Formspree/Turnstile: `formspree.io/f/mgaelqjw`, `challenges.cloudflare.com`; configured public identifiers, inactive delivery. Browser-only captcha checks cannot prevent direct endpoint abuse: server validation must reject missing/invalid/replayed tokens. Test with owner-approved sample data after mailbox setup; no test enquiries sent in this review.
- No marketing checkbox/list or analytics collection has been introduced. Necessary security processing still needs transparent disclosure and provider review.

## Security and resilience limits

Client-side length limits, honeypot, captcha state, double-submit protection, timeout handling, CSP and iframe sandboxing are defence in depth. Server-side abuse controls, quotas, attachment policy, mailbox security, account MFA, recovery, processor retention/deletion and request limits must be checked in provider dashboards. Captcha does not eliminate all spam. Free-tier quotas can interrupt delivery; the disabled form must not be advertised as operational.

GitHub Pages does not implement `_headers` files or arbitrary server code. Response security headers and Cloudflare proxy/DNS status were not configured in this change. Do not use a meta `frame-ancestors` directive as a substitute for a response header. See SECURITY.md for prior checks and remaining account-level work.

## Validation

`node --test tests/*.test.cjs`: 30 tests pass, including consent refusal/persistence, malformed/expired/future state, unavailable storage, cross-tab withdrawal, feed blocking, aborted requests, safe post rendering, helper message gating, keyboard service tabs and enquiry failure handling.

`python scripts/audit-static.py`: 14 content pages checked for local link/file existence, alt attributes, unique IDs, language and main targets. Selected palette ratios: dark on white 17.07:1; muted on white 6.27:1; muted on paper 5.72:1; dark on lime 12.92:1; policy links on white 12.05:1. These calculations do not assess every rendered state or photo background.

No axe, Lighthouse, Cookiebot or real-browser cookie scan was run. No compatible supervised browser preview was available for this buildless project. Do not present source/VM tests as rendered accessibility or cookie compliance evidence.

Manual release checks: fresh browser no social requests before choice; reject and reload; allow each provider independently; revoke with a request pending; test storage disabled/cross-tab; inspect post-consent cookies/storage; open helpers directly; keyboard/focus/zoom/mobile navigation; no-JS policy links; mailbox receipt and server captcha failures once configured.

## Sources reviewed

- [ICO: privacy information to provide](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/the-right-to-be-informed/what-privacy-information-should-we-provide/)
- [ICO: contract lawful basis](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/a-guide-to-lawful-basis/contract/)
- [ICO: storage and access technologies](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/)
- [Business Companion: distance contracts](https://www.businesscompanion.info/en/quick-guides/distance-sales/consumer-contracts-distance-sales)
- [Business Companion: supplying services](https://www.businesscompanion.info/en/quick-guides/services/supplying-services)
- [GOV.UK: company website disclosures](https://www.gov.uk/running-a-limited-company/signs-stationery-and-promotional-material)
