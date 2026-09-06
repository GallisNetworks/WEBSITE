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

TikTok and Facebook have optional official embeds and persistent profile links. Their actual post rendering has not been browser-verified; platform privacy, login and embed restrictions may prevent display even when a frame loads. Instagram remains a profile link until a supported feed integration is selected. X needs the owner's exact profile URL before its fourth panel can be connected. Do not promise that all four auto-updating feeds work yet.

## References checked 6 September 2026

- [Formspree Turnstile setup](https://help.formspree.io/articles/form-and-project-settings/protecting-your-forms-with-cloudflare-turnstile/)
- [Cloudflare server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
