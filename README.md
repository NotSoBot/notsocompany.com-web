# notsocompany.com-web
NotSoCompany's Cloudflare Worker for `notsocompany.com`:
- `notsocompany.com/`: what the company owns (NotSoBot), laid out like nsb.gg's home page (`src/Home.tsx`, `index.html`)
- `notsocompany.com/privacy`: the company's privacy policy, for this site and the Umami analytics it, notsobot.com and nsb.gg load from `oasis.notsocompany.com` (notsobot.api's `analytics-umami`). NotSoBot's own policy is notsobot.com's (`src/Privacy.tsx`, `privacy.html`)
- `www.notsocompany.com`, `notso.company`, `www.notso.company`: 301 to `notsocompany.com` with the path and query kept (`REDIRECT_DOMAINS` in `worker/index.ts`)
- any other subdomain of either zone: a 404 (`{"code": 0, "message": "Not Found", "status": 404}`, like nsb.gg), the routes are catch-alls (`*notsocompany.com/*`, `*notso.company/*`)

Laid out like nsb.gg-web: the worker is in `worker/` (routed with cf-worker-router, one `DomainRouter` per host), the pages (React + Tailwind + lucide-react) are in `src/`, one html file each so they have their own metatags.
`npm run build` puts them in `dist/` (gitignored), which the worker serves through [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/).
Every request runs the worker first (`run_worker_first` in `wrangler.jsonc`), otherwise the redirect domains would get the page too.

```bash
npm install
npx wrangler login       # once (on a server without a browser, put CLOUDFLARE_API_TOKEN/CLOUDFLARE_ACCOUNT_ID in .env instead, see .env.example)
npm run dev              # the page alone, with hot reload
npm run preview:worker   # the production build + worker locally
npm run deploy
```

## Analytics

The worker adds the Umami script from `oasis.notsocompany.com` to every page's `<head>` when `UMAMI_WEBSITE_ID` is set (notsocompany.com's own website in Umami, next to notsobot.com's and nsb.gg's). It lives in `.dev.vars` (gitignored), which `npm run preview:worker` reads and `npm run deploy` uploads as the worker's secret every time (`--secrets-file`), so the deploy fails without it. Empty leaves analytics off:

```bash
cp .dev.vars.example .dev.vars
```

`npm run dev` is vite alone, without the worker, so it never loads analytics.

## Logo

`src/assets/logos/NotSoCompanyLogo.svg` is NotSoBot's sunglasses cut out of its logo, exactly as they are there (the logo is `.magik` on `.b1`), outlined in the head's gray so the dark frame still shows on dark backgrounds. The cut is an svg mask over the logo's own paths: the dark silhouette, minus the gray head and face, minus the outline ring. The gray outline is an svg filter around that.
`scripts/render-logo.cjs` writes it from `src/assets/logos/NotSoLogo.svg` and renders `public/favicon.ico` (16/32/48px) and `public/logo.png` (the 512px embed image, on the page's `deep` background) from it. It borrows notsobot.com-web's `sharp`, so that repo needs its `node_modules`:

```bash
node scripts/render-logo.cjs
```
`src/assets/logos/NotSoLogo.svg` and its hover effects (`src/assets/logos/effects/`) are NotSoBot's, copied from notsobot.com-web.

## DNS

The routes only run on proxied records, so each hostname needs one (`100::` is a placeholder address, the worker answers before anything reaches it). The `*` records are what let any other subdomain reach the worker's 404, without them those names don't resolve at all:

| Zone | Type | Name | Content |
|---|---|---|---|
| notsocompany.com | `AAAA` (proxied) | `notsocompany.com` | `100::` |
| notsocompany.com | `AAAA` (proxied) | `www` | `100::` |
| notsocompany.com | `AAAA` (proxied) | `*` | `100::` |
| notso.company | `AAAA` (proxied) | `notso.company` | `100::` |
| notso.company | `AAAA` (proxied) | `www` | `100::` |
| notso.company | `AAAA` (proxied) | `*` | `100::` |

`oasis.notsocompany.com` is notsobot.api's Umami, not this worker: a proxied `A` record to the api server (it wins over `*`), with a Cloudflare origin certificate for it in notsobot.api's `secrets/certificates/umami.{cert,key}`.
`*notsocompany.com/*` would send it to this worker too, so the zone also needs a route that runs no worker, which `wrangler.jsonc` can't express. In the dashboard, notsocompany.com → Workers Routes → Add route: `oasis.notsocompany.com/*`, Worker: None. The more specific route wins, so oasis goes straight to the api server.

notsocompany.com receives mail (`privacy@notsocompany.com`), leave its MX/SPF/DKIM records alone. notso.company never sends or receives any, so it rejects spoofed mail:

| Zone | Type | Name | Content |
|---|---|---|---|
| notso.company | `MX` | `notso.company` | `.` (priority 0, a null MX) |
| notso.company | `TXT` | `notso.company` | `v=spf1 -all` |
| notso.company | `TXT` | `_dmarc` | `v=DMARC1; p=reject` |
