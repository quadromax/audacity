# Historical optional infrastructure notes

The cinematic redesign does not use this account, missions, reward, or database UI. None of the credentials below are required to launch. Token configuration now lives exclusively in src/config/token.ts. This document preserves the earlier backend setup for future development; its token environment settings and old UI instructions are superseded by README.md.

# Trusted administrator workflow

There is deliberately no public admin form. Administration uses the authenticated Supabase project dashboard (project-owner/editor access), protected by the administrator’s account and MFA. This is the secure configuration-driven alternative. Never grant service_role to website users or put its key in a NEXT_PUBLIC variable.

## Global configuration

Edit the environment variables in `.env.local` or Vercel project settings, then rebuild/redeploy. Configure mint, ticker, project name, social links, release timestamp and announcement here. Missing/invalid social URLs are omitted, and an absent mint disables trading and copying. Supply RELEASE_TARGET only after checking a primary official source, with an explicit timezone (ISO 8601 Z or offset). No release date is bundled.

## Content

Use the Supabase Table Editor for `social_posts`, `missions`, and `rewards`. All browser writes are revoked. Posts appear only with `published=true`; missions only with `active=true`. Use real public HTTPS post URLs, actual measured counts or NULL, and locally committed image/video paths. Uploading assets means adding them to `public/assets/` in the source checkout and deploying. No scraped social metrics or X credentials are required.

Configure missions with an explicit title, description, eligibility/requirements, server-owned points, and HTTPS action URL. The UI accepts a public evidence URL. It never treats an outbound click as completion.

## Review and points

Inspect pending evidence in `mission_submissions`. Verify that it belongs to the signed-in participant and satisfies the published mission. Do not rely on the submitted URL alone. In the SQL editor call:

```sql
select public.approve_submission('ACTUAL-SUBMISSION-UUID');
```

The transaction locks the submission, reads points from the active mission, inserts one completion and one point transaction, then marks approval. Repeated approval is idempotent. Concurrent awards cannot duplicate the unique user/mission pair. Browser roles cannot execute this function. Reject evidence by setting status to `rejected` in the dashboard. To request corrections, deliberately reset that row to pending with corrected evidence after review; self-service resubmission is not implemented.

An account may complete a mission once. Email authentication, per-user database rate limits and manual review provide baseline abuse protection, not Sybil resistance. Configure Supabase email rate limits and CAPTCHA before an incentivized public campaign. Apply operational restrictions to new accounts if needed. A unique wallet cannot be associated with multiple profiles. Never approve evidence using client-provided points.

## Rewards

Publish only funded, authorized campaigns. Set title, description, eligibility, ranking requirement within eligibility, rules, image_path, and status (`coming_soon`, `active`, `closed`). `claim_url` is an external HTTPS rules/claim destination, enabled only for active campaigns. The website does not send payouts, sign transactions, or automate prize eligibility. `reward_claims` is a protected operational ledger with unique user/reward rows for manual reconciliation. Duplicate payout prevention at the payment destination remains that operator’s responsibility.

## Housekeeping

Remove expired wallet_challenges and old rate_limits rows periodically via Supabase scheduled SQL. Keep audit trails for human approvals and prize fulfillment. Rotate service keys if compromised. Review Supabase project membership. `leaderboard_snapshots` and `site_settings` are reserved for future rank-movement/content extensions; the current UI does not invent rank movement.


