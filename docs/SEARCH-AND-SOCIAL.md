# Search visibility and social feeds

## Implemented in the review branch

- Motto updated to **Resilient networking** throughout current page copy and metadata.
- Eight crawlable HTML service pages with useful service content, unique titles/descriptions, canonical URLs, related links and Service/Breadcrumb structured data. The homepage links to every page; search discovery does not depend on clicking JavaScript tabs.
- Homepage Organization/WebSite structured data with the real business name, logo, slogan and confirmed social URLs. No invented reviews, ratings, address, opening hours or national service coverage.
- Public XML sitemap listing the homepage and eight services; robots.txt advertises that sitemap and permits crawling.
- Stable square PNG favicon (192 px), 512 px logo and Apple touch icon mechanically derived from the existing logo. Google determines whether and when it displays the favicon or logo; this is eligibility, not a guarantee.
- Existing terms PDF removed from published files on the branch. Its original remains in Git history. The replacement terms draft, privacy notice, legacy redirects and social embed page use noindex. Do not block these HTML pages in robots.txt: crawlers need to see noindex.
- The old terms PDF had US state/federal court and American Arbitration Association wording plus outdated service promises and contact details. It has not been rewritten as legal advice; the final terms require owner review before release.
- Private review copies receive noindex on every HTML page and a separate robots file; they are not submitted to search engines. GitHub Pages remains the intended live hosting.

## Complete after approval and live release

1. Confirm one canonical domain: https://www.gallisnetworks.com/. The supplied Facebook search screenshot mentions gallisnetworks.co.uk; check whether it is owned and update profile website links to the correct destination. Do not alter DNS or redirects based on assumption.
2. Verify the domain property in Google Search Console using its actual TXT record in the authoritative DNS manager (Namecheap is the confirmed registrar/provider, delegation still to be checked). Never invent a verification token or put account credentials in the repository.
3. Submit https://www.gallisnetworks.com/sitemap.xml after the redesign is live. Inspect the homepage and key service URLs; request indexing and check the favicon is crawlable. Check Google-selected canonical URLs, crawl/indexing errors and mobile performance.
4. Verify Bing Webmaster Tools and submit the same sitemap. This also helps coverage by services using Bing's index. No account registration or submission has been performed yet.
5. The old /files/TermsandConditionsforGallisNetworks.pdf URL will return 404 after release. Allow crawlers to discover removal. Search Console's temporary removal tool can speed suppression when the owner has verified access. A robots.txt Disallow alone cannot reliably remove an already indexed PDF. GitHub Pages does not provide project-defined response headers for an X-Robots-Tag, hence the HTML replacement.
6. Keep the business name, domain and profile details consistent. Add real examples of work only with permission, useful original service content and genuine reviews when available. Do not manufacture local landing pages, testimonials, backlinks or credentials.
7. Confirm eligibility before creating a Google Business Profile. Do not claim a staffed location, customer-facing office or in-person service area if the business does not actually provide it. Remote-only online businesses may not qualify.
8. Measure enquiries alongside search impressions/clicks. Search rankings, logo display and AI-answer inclusion cannot be guaranteed; search engines choose their own snippets and may take time to recrawl.

No meta-keyword stuffing, automated backlink schemes, fabricated FAQs or promised top rankings are included.

## Social identities

- TikTok: https://www.tiktok.com/@gallisnetworks — supplied profile screenshot and original website.
- Instagram: https://www.instagram.com/_gallis_networks_/ — supplied profile screenshot.
- Facebook: https://www.facebook.com/people/Gallis-Networks/61572970461203/ — exact Page link in the original website, matching the supplied branded search result. Live Facebook content could not be read from this environment; verify its public Page/plugin visibility during review.
- WhatsApp intentionally absent until the owner provides the business number.

## Three social panels

The homepage has three side-by-side cards on wide screens, stacking on mobile. All have real profile links.

TikTok: a visitor can load the official creator-profile embed. TikTok supplies up to ten recent public videos; it is not guaranteed to select exactly one latest post or refresh within a specific interval. It updates from TikTok when loaded without manually replacing post URLs.

Facebook: a visitor can load the Page timeline plugin. Facebook controls availability, order and rendering; privacy, login and Page restrictions can prevent display. The external feed has not been visually verified here, and the direct profile link remains available.

Instagram: currently a real profile link, not a fabricated or auto-updating feed. An authorised feed integration has not been connected. To display exactly one recent post per platform consistently, choose a managed feed provider supporting these three account types, connect the actual accounts, confirm refresh cadence/limits and provide its public embed IDs/code. Alternatively build an authenticated backend with platform-approved APIs. Account tokens must remain in the backend/provider; do not put them in browser code or the public repository. The plugin catalogue was checked; the returned analytics/scheduling apps did not provide this website-feed capability.

No browser scraping, embedded login prompts, or fake latest-post timestamps. External content loads only after a visitor chooses it, and can be removed. Removing an embed does not delete cookies already set by the platform. Complete the final privacy notice to match the chosen provider before release.

## Sources checked 6 September 2026

- Google favicon guidance: https://developers.google.com/search/docs/appearance/favicon-in-search
- Organization structured data: https://developers.google.com/search/docs/appearance/structured-data/organization
- noindex: https://developers.google.com/search/docs/crawling-indexing/block-indexing
- Sitemaps: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- TikTok creator embed: https://developers.tiktok.com/docs/en/embed-creator-profiles
- Facebook Page plugin: https://developers.facebook.com/docs/plugins/page-plugin/ (documentation fetch rate-limited; confirm live rendering during review)
