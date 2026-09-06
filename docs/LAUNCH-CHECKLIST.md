# Website launch checklist — screenshot additions

Added to draft PR #2 on 6 September 2026. This records every item in the supplied 20-point screenshot. The enquiry form remains inactive until its existing gates pass.

| # | Item | Result |
|---|---|---|
| 1 | Custom 404 | Added root 404.html with root-relative assets and recovery links, so nested missing URLs work on the custom domain. Confirm actual HTTP 404 after deployment. |
| 2 | CTA above fold | Existing hero project CTA retained; mobile viewport placement still needs rendered testing. |
| 3 | Internal links | Existing related-service navigation retained; added service-area and recovery links. |
| 4 | Thank-you page | Added thank-you.html; next-steps link appears only after a successful submission response. Direct page visits explicitly do not prove receipt. No personal details in URLs or browser storage. |
| 5 | Breadcrumbs | Added visible Home / Services / current page navigation to all eight service pages, alongside existing structured breadcrumbs. |
| 6 | Case studies | Awaiting genuine project scope, work, outcomes and publication permission. No sample project presented as completed work. |
| 7 | Five FAQs | Five homepage questions covering customers, existing equipment, staged work, quotes and service area. |
| 8 | Response-time promise | Availability is agreed; no invented SLA. Owner must supply a sustainable business-day response target before one is published. |
| 9 | Sticky mobile CTA | Added project enquiry link on homepage and service pages, with bottom spacing and safe-area padding. Consent panel takes precedence. Manual touch/zoom test outstanding. |
| 10 | robots.txt | Existing file retained, alongside sitemap. Legal/utility pages use noindex rather than robots blocking. |
| 11 | Unique page titles | Homepage, service, policy and new utility titles are distinct. Legacy redirects are compatibility routes. |
| 12 | Meta descriptions | Retained homepage/service descriptions; added policy and utility descriptions. |
| 13 | Social share image | Added absolute Open Graph and X image tags using the existing 512px square brand logo. No new artwork or image edits. Platform caching/preview display is not guaranteed. |
| 14 | Maps and directions | Visible Hereford/surrounding-area and remote UK coverage added. No customer-facing premises confirmed; do not publish home-address directions or a misleading map pin. Await actual visitor address and appointment arrangements if relevant. |
| 15 | Real reviews | Awaiting genuine review text/source and permission. No fabricated reviews, ratings or Review schema. |
| 16 | Image alt text | Source checks confirm alt attributes; existing descriptive text retained. Human review of purpose and embedded provider accessibility remains necessary. |
| 17 | Local schema | Added confirmed service area to Organization markup. Full LocalBusiness search markup is deferred until required, accurate address/business details are available. No fake hours, address, phone or ratings. |
| 18 | Privacy-policy page | Included in the existing policy work; remains clearly a review draft until business/contact/provider details are final. |
| 19 | Google Analytics | Not installed or activated: no GA4 property identifier supplied. Implementation specification below; no Google tracking requests introduced. |
| 20 | Team photo | Awaiting a genuine owner/team photograph with permission. No stock people represented as the team. |

## Google Analytics activation specification

Owner input: GA4 web-stream measurement ID (public `G-…`, not an account password), chosen retention and approved privacy wording. Use a separate optional Analytics control; never bundle it with social choices or enquiry processing. Increment consent version so old social permissions cannot authorise analytics.

Use basic consent mode: do not load Google scripts or send pings before explicit analytics permission. Set advertising consent denied, disable Google signals, advertising personalisation and enhanced measurement features not actually needed; start with minimal page-view measurement only. Send a clean canonical page path/title, never enquiry values, email, phone, search/query parameters or form contents. Do not count direct thank-you-page visits as successful enquiries.

On withdrawal disable collection immediately, remove accessible analytics cookies for the configured domain/path and reload without tags where needed. Previously transmitted data cannot be recalled by a browser toggle. Check storage behaviour and update the actual cookie inventory, processor/transfer review, CSP allowlist and privacy notice before activation. Test no Google requests before choice, refusal persistence, grant, withdrawal, cross-tab changes and expiry. Browser storage unavailable must remain fail-closed for tracking.

No analytics code is included until those decisions are complete. This avoids silently introducing a tracker into pages whose policy currently says none is installed.

Sources: [Google basic versus advanced consent mode](https://developers.google.com/tag-platform/security/concepts/consent-mode), [Google LocalBusiness requirements](https://developers.google.com/search/docs/appearance/structured-data/local-business), [Organization markup](https://developers.google.com/search/docs/appearance/structured-data/organization).

## What the owner needs to supply

- Genuine case study material and review sources/permission, if any exist.
- Real portrait/team photograph and usage permission.
- Sustainable response target, e.g. a number of business days, if a promise is wanted.
- Customer-visitable premises address only if applicable; otherwise retain service-area wording.
- GA4 measurement ID and privacy configuration decisions when ready.
- Legal identity/contact and image evidence already requested in COMPLIANCE-REVIEW.md.

Do not publish empty testimonial, case-study or team sections. These items can be added as the business develops.
