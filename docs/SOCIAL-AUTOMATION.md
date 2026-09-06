# Social scheduling: free self-hosted option

Recommendation: evaluate Postiz on a dedicated VM using its official Docker Compose deployment. Its open-source software can be self-hosted without a software subscription. It offers a calendar and queues for advance scheduling, with integrations covering the five requested platforms. Hosting, maintenance, platform API charges and optional AI services are separate costs. This is a recommendation, not an installed or connected service.

Do not migrate every channel from Buffer/Publer until each replacement integration successfully publishes an authorised test. Export/copy the existing content calendar first and prevent duplicate schedules during cutover.

## Platform constraints

| Account | Practical position |
| --- | --- |
| Bluesky | Supported; use a dedicated app password or the current supported authorisation flow, never the primary password in public files. |
| Instagram professional | Supported; Postiz documents standalone Instagram or Facebook-linked connection. Both need Meta developer setup and appropriate permissions. Professional status alone does not grant API access. |
| Facebook Page | Supported with Meta developer setup and Page permissions; verify the correct business Page during authorisation. |
| X | Supported, but X currently uses paid API credits. Free software does not make automated X posting free. Keep existing scheduling/manual posting if zero platform spend is essential. |
| TikTok | Major restriction: public Direct Post needs an audited app. TikTok's guidelines exclude internal/private account-upload utilities from acceptable intended use. A personal self-hosted scheduler must not be assumed eligible. Retain an approved provider or manual publishing unless the actual integration is approved. |

## Proposed operating setup

Start with a dedicated Linux VM and Docker Compose, separate from the public website and other sensitive workloads. Postiz recommends 4 vCPU, 8 GB RAM and 50 GB plus persistent upload storage for a small team; its documented supported floor is lower. Confirm spare host capacity before allocating it.

Use HTTPS and restrict administrative access. Configure public OAuth callbacks and media paths deliberately: social platforms may need to reach these, so putting every route behind a private VPN can break posting. Never expose PostgreSQL, Redis, Temporal administration or the Docker socket publicly. Disable open registration where the selected release supports it and configure strong authentication.

Store app credentials only in private server configuration with restricted permissions. Pin a supported release, review advisories and updates, and back up the database, media and required encryption/configuration secrets securely. Test a restore. Monitor the publishing worker, failed jobs, available storage and account-token expiry. A home server's power or internet outage can interrupt scheduled publishing; keeping the customer website on Pages avoids coupling those failures.

Plan 30–90 days of approved posts in the calendar, set Europe/London for local scheduling and review the queue monthly. Reuse evergreen material selectively and update offers or claims before publication. Do not automatically replay a large backlog after an outage without checking for obsolete or duplicated posts. No social posts or schedules have been created by this task.

Scheduling and website feeds are different integrations. A scheduler does not automatically grant public read/feed access for every platform. The website currently has direct links for all five accounts, official optional embeds for TikTok/Facebook/X and a public Bluesky feed. Instagram's automatic feed still needs a protected API/provider connection.

## Sources checked 6 September 2026

- Postiz source and licence: https://github.com/gitroomhq/postiz-app
- Deployment: https://docs.postiz.com/self-host/installation/docker-compose
- Requirements: https://docs.postiz.com/self-host/installation/system-requirements
- Instagram: https://docs.postiz.com/self-host/providers/instagram
- TikTok integration: https://docs.postiz.com/self-host/providers/tiktok
- TikTok intended-use restrictions: https://developers.tiktok.com/doc/content-sharing-guidelines/
- X pricing: https://docs.x.com/x-api/getting-started/pricing
- Mixpost Lite is not a complete alternative for these accounts: its Bluesky integration requires Pro, https://docs.mixpost.app/services/social/bluesky/
