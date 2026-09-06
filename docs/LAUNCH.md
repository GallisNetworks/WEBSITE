# Gallis Networks redesign — review and launch

This branch is a review draft, not a live release. Do not merge until the outstanding owner decisions and email delivery checks below are complete.

## Preserved publishing setup

- Existing repository: GallisNetworks/WEBSITE; base branch: main.
- Existing CNAME remains byte-for-byte unchanged: www.gallisnetworks.com.
- Site entrypoint remains index.html at the repository root. All files are static; no build, package installation, framework, server or new deployment service is required.
- No Pages settings, DNS records or publishing workflows have been changed. There were no tracked .github workflows or .openai hosting files in the base commit.
- GitHub's repository API confirmed has_pages=true and the connected GallisNetworks account's admin/push permissions. The connector did not expose the Pages settings endpoint, so the configured publishing branch/folder could not be independently read. Check Settings → Pages before merging; preserve its current source rather than selecting a new one.
- Home.html, cookie-policy.html and the old sample blog URLs are retained as redirects with plain links for compatibility. The old blog was placeholder content, not a claimed project portfolio.

## Brand and service direction — updated owner brief

The owner has shortened the motto to “Resilient networking”. The owner wants the established business identity and broad service coverage retained, with no “small projects” or evening/weekend framing in public copy.

The owner has requested networking, cybersecurity, cameras/CCTV, IoT, drones and digital services. The draft now has eight service tabs: Networking, Cybersecurity, Cameras & CCTV, IoT & smart homes, Drones, Starlink, Websites and Solutions architecture. Each includes existing imagery, useful project considerations and a service-specific enquiry link. Public copy makes no guaranteed availability, response time, partnership, regulatory qualification or completed-project claims. Installation and flight arrangements must still be confirmed per enquiry; a broad service category must not be treated as a promise of immediate on-site delivery.

Namecheap is the domain provider. Existing email hosting is still unknown; authoritative DNS delegation has not been independently checked.

Original logo and lime/purple/charcoal palette are retained. Three illustrative service images have been replaced with real photography. TikTok, Instagram and Facebook URLs are now supplied or recovered from the original site. See SEARCH-AND-SOCIAL.md and IMAGE-CREDITS.md.

The enquiry and three-step process are retained, with expanded service options. Contact form activation, mailbox selection and privacy completion remain outstanding.

## Enquiry delivery: proposed Formspree setup

Recommendation: Formspree for this static website. It accepts the custom form directly and sends notifications without putting an email password or secret API key in the site. A managed form service avoids maintaining a separate server for a small enquiry flow. A separate backend is an alternative if custom routing, storage or processing requirements later justify it. Provider selection is still the owner's decision.

1. Confirm the domain email provider and mailbox first. Do not use an uncreated address in a live form.
2. Create/select a business-owned Formspree account and form. Choose and verify the business mailbox as its notification recipient in Formspree. The website's contactEmail setting DOES NOT configure the recipient in Formspree.
3. Confirm the selected plan's current submission limits, retention, notifications and spam controls before subscribing. Do not assume a specific free quota or paid price.
4. Follow SECURITY.md to configure Formspree server-side Turnstile verification. The website now renders the challenge when configured, but that alone cannot stop direct endpoint abuse. Keep the form inactive until server tests pass.
5. Put only the public form ID into assets/config.js → formspreeId. The endpoint https://formspree.io/f/FORM_ID is intended to be public; account/API credentials are not.
6. Set contactEmail to the chosen, verified @gallisnetworks.com address. The input named email supplies the customer's Reply-To address on Formspree notifications.
7. Replace the preview privacy page with the final business notice covering the actual providers, contact, purpose/lawful basis, retention, rights and any international transfers. The old terms PDF is removed from the release and retained in Git history. Complete the noindex HTML terms page before launch.
8. Set privacyReviewed, serverProtectionVerified and enquiriesEnabled to true only after completing configuration and server-side rejection tests. Set the public turnstileSiteKey; never store its secret here. Blank, invalid or incomplete configuration keeps submission disabled. Do not treat these frontend flags as access controls.
9. Send a clearly labelled test enquiry after authorisation, check every field arrives, and reply from the domain mailbox. Confirm the recipient sees the domain address, not Gmail. Verify delivery with an external mailbox and check spam folders. Do not enable customer autoresponders until their sender/domain configuration is confirmed.
10. Test success, rejection, offline/timeout, keyboard access and mobile layout. No real email has been sent by the automated checks in this branch.

Official references, checked 6 September 2026:
- [Formspree HTML forms](https://formspree.io/html/)
- [Email Reply-To](https://help.formspree.io/articles/building-your-form/email-reply-to-address/)
- [Formspree plans](https://formspree.io/plans/)

## Domain mailbox: proposed options

| Option | Suitable when | Status |
| --- | --- | --- |
| Existing domain email hosting | An existing paid mailbox is already available | Check before buying anything |
| Google Workspace | You want familiar Gmail software with a professional domain address for receiving and replying | Recommended if starting fresh and you prefer Gmail |
| Microsoft 365 Business Basic | You prefer Outlook and Microsoft business tools | Alternative |

Suggested address: hello@gallisnetworks.com — not yet chosen, created or verified. Ordinary email forwarding alone is not a complete sending/replying setup.

Once the provider is chosen, verify domain ownership and follow its exact DNS instructions for MX, SPF and DKIM. Review current records before changing them; do not create multiple SPF records. Introduce DMARC with monitoring and review authentication before tightening policy. Preserve the website's existing A/AAAA/CNAME records. The provider's account-specific DNS values must come from its admin console, not guesses in this repository.

References:
- [Google Workspace business email](https://workspace.google.com/intl/en_uk/business/new-business/)
- [Microsoft 365 Business Basic](https://www.microsoft.com/en-gb/microsoft-365/business/microsoft-365-business-basic)

## Phone and WhatsApp

No phone number or WhatsApp link is included in the redesigned pages. The owner asked for another approach; clarify whether that means an alternative to eSIM/WhatsApp or to the proposed email/form services before selecting anything. A separate business number remains unconfigured. Do not add an old number or an unverified replacement during release.

## Review and release

- Review the expanded service wording against the owner’s brief. Confirm actual delivery arrangements for each enquiry; public copy must not promise availability that has not been agreed.
- Complete and verify mailbox, form and privacy setup.
- Review the design on desktop and mobile. Browser visual testing has not been performed in this environment.
- Review the pull request; merge only after owner approval. Do not enable auto-merge.
- Verify the existing GitHub Pages deployment completes after merging, check the custom domain and test the live enquiry flow.
- If rollback is needed, revert the merged redesign commit through a new reviewed PR; do not force-push main.

## Maintenance and local checks

Edit index.html for copy, assets/site.css for styling, assets/site.js for behaviour and assets/config.js for public form configuration. Existing Nicepage assets remain unused to keep this review focused and preserve rollback context.

Run `node --check assets/site.js`, `node --check assets/config.js` and `node --test tests/*.test.cjs`.

## Search and social release checks

Follow SEARCH-AND-SOCIAL.md before claiming indexing or automatic cross-platform feed delivery. The new service pages and sitemap need a live release before submission to search engines. The Instagram automatic feed is not yet connected.
