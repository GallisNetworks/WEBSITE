# Security and resilience — deployment checklist

## Implemented in this draft

- Form remains inactive: no endpoint, mailbox or Turnstile key is configured.
- When configured, Turnstile must return a token before the page sends. Expiry, load failure and challenge errors disable sending. Every attempt invalidates the token and resets the widget.
- Only the public site key belongs in config.js. Formspree must hold and verify the secret.
- Existing honeypot, field limits, duplicate-click guard and 20-second request timeout remain. Failed or uncertain requests preserve entered details; there is no silent retry and no storage of enquiry text in localStorage.
- Main, service and legal pages have a meta Content Security Policy restricting scripts, connections, frames, form destinations, base URLs and plugins. Structured-data scripts have content hashes: recalculate these after editing their JSON. The separate TikTok helper is a third-party embed document, outside this main-page policy.
- Referrer policy limits information passed to other origins.
- Static service content does not depend on social platforms. Profile links remain available when embeds fail.
- No secret credentials, admin login, database or upload endpoint is added to Pages.

These are code-level measures, not proof of provider configuration or a guarantee against spam.

## Before enabling enquiries

1. Select the mailbox and form provider. Verify the recipient inside Formspree.
2. Create a Cloudflare Turnstile managed widget with only the approved production hostname(s). Do not disable hostname validation. Use a separate test form/widget for testing the private preview; never use always-pass test keys in production.
3. In Formspree settings enable CAPTCHA, select Cloudflare Turnstile and enter its secret in that dashboard. Put only the public site key in assets/config.js.
4. Review available provider spam filtering, blocklists, submission limits and domain restrictions. Domain restrictions alone do not authenticate visitors.
5. With authorised synthetic test data, call the form endpoint directly without a token, with an invalid token, and with a previously used token. All must be rejected and must not generate delivered enquiries. A frontend disabled button is not evidence.
6. Test a genuine fresh challenge, delivery to the verified mailbox and replying from the domain address. Test network failure, challenge expiry, blocked scripts and provider rejection. No real delivery or backend rejection tests have yet been performed.
7. Confirm privacy, retention, account recovery and access. Enable the configuration flags only after the checks pass. serverProtectionVerified is a release checklist marker, not a security boundary.
8. Review the old Jotform separately: changing this website cannot stop abuse of an old public form URL. Retire it only after checking legitimate uses and preserving required enquiries; no old form has been deleted or disabled here.

## Hosting and recovery

Keep GitHub Pages and its current publishing configuration. Verify HTTPS enforcement in repository settings before launch. Meta CSP cannot enforce frame-ancestors, HSTS or other HTTP response headers; no unsupported _headers file has been added. A reverse proxy would require a separate agreed DNS/hosting change.

Review two-factor authentication and recovery for GitHub, Namecheap, the mailbox and form service. Keep DNS changes and release history. Use a reviewed revert PR to roll back a bad deployment; do not force-push main. Monitor provider quotas and check both spam and delivery queues periodically. These account checks remain outstanding.

## Social feed status

TikTok and Facebook have optional official embeds and persistent profile links. Their actual post rendering has not been browser-verified; platform privacy, login and embed restrictions may prevent display even when a frame loads. Instagram remains a profile link until a supported feed integration is selected. X and Bluesky URLs are now supplied. X has an optional isolated timeline widget. Bluesky has a working public-API integration with live API response verified, bounded requests and safe text rendering. Do not promise that all five auto-updating feeds work yet.

## References checked 6 September 2026

- [Formspree Turnstile setup](https://help.formspree.io/articles/form-and-project-settings/protecting-your-forms-with-cloudflare-turnstile/)
- [Cloudflare server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)

## Follow-up review — 6 September 2026

Fixed in this revision:
- Local TikTok and X helper frames no longer combine allow-scripts with allow-same-origin, preventing provider scripts from gaining the parent page's origin through those frames. The Facebook frame uses a different origin.
- Feed errors/timeouts retain direct profile links. Bluesky text cannot become executable markup; only expected authors and permitted CDN image URLs are rendered. Pending results cannot reinsert content after a visitor removes the feed.
- Form requests omit cookies and refuse redirects. HTTP 429 gets an explicit quota/rate-limit message and email fallback, with entered details retained.
- Challenge lifecycle messages use a separate status region so they cannot overwrite a successful receipt or an uncertain-delivery warning.
- CSP now starts with default-src self on normal pages. Inline JavaScript/eval remain blocked. Inline styles are permitted for widget compatibility; this is not a strict nonce-based CSP. Helpers have a limited policy and rely on their parent sandbox for origin isolation.
- Static CSP hashes can be regenerated using python scripts/update-csp.py. Security tests verify them.
- Local environment and private-key file patterns are ignored by Git as an accidental-commit guard.

Evidence and limits:
- Connected GitHub identity rechecked: GallisNetworks; repository permission admin. Reading main branch protection returned HTTP 403 (integration lacks access), so protection rules are unverified and unchanged.
- Live www.gallisnetworks.com returned HTTP 200 with certificate verification passing. Its current response lacked CSP, HSTS, X-Content-Type-Options, X-Frame-Options and Referrer-Policy headers. The live site remains unchanged.
- Targeted scan of tracked text files found no matches for private-key blocks, common GitHub token prefixes or AWS access-key IDs. This is not a complete historical or credential audit.
- Automated tests cover challenge expiry/failure, token reuse, provider failure/429, timeout, duplicate submission, delivery-message preservation, feed isolation, hostile text, bad URLs, malformed data, cancellation and refresh failure.
- Browser embed rendering is unverified: the plain static review project has no compatible supervised browser preview in this environment.
- Formspree, Cloudflare, Namecheap, mailbox, Jotform and social account settings have not been accessed. No CAPTCHA server setting, secret, DNS record, WAF rule, account MFA, rate-limit configuration or email routing has been changed.

## Free starting configuration

Use GitHub Pages plus Formspree Free and Cloudflare Turnstile Free for initial low-volume enquiries, subject to setup and delivery testing. Formspree Free currently starts at 50 submissions/month with 30-day submission history; it sends quota notifications. Monitor these limits and retain the domain-mailbox fallback rather than treating the free allowance as unlimited capacity.

Turnstile Free permits unlimited challenges and can be used without moving DNS or the website to Cloudflare. Add production hostnames, keep the secret solely in the Formspree dashboard, and validate server rejection before enabling enquiries. Neither service has been connected yet. A professional receiving/replying mailbox remains a separate decision and is not included in this free website/form combination.

References:
- https://help.formspree.io/articles/account-management/account-limits/
- https://help.formspree.io/articles/form-and-project-settings/system-limits/
- https://developers.cloudflare.com/turnstile/plans/
- https://developers.cloudflare.com/turnstile/reference/content-security-policy/
