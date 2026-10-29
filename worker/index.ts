// Serves the built pages (dist/) through Workers Static Assets on notsocompany.com. Its routes catch every subdomain of
// notsocompany.com and notso.company (see wrangler.jsonc), like nsb.gg's: the www and short domains redirect to
// notsocompany.com and any other host gets cf-worker-router's 404. oasis.notsocompany.com (umami) never reaches this,
// it has its own "no worker" route on the zone (see the readme).

import { ApiRedirect, DomainRouter, FetchRouter } from 'cf-worker-router';


interface Env {
  ASSETS: Fetcher,
  // notsocompany.com's website id from oasis.notsocompany.com's website settings. a secret from .dev.vars, uploaded by
  // `npm run deploy`. empty or unset leaves analytics off
  UMAMI_WEBSITE_ID?: string,
}


const SITE_DOMAIN = 'notsocompany.com';

// short and www domains that only redirect to SITE_DOMAIN, keeping the path and query (notso.company/ -> notsocompany.com/)
const REDIRECT_DOMAINS = ['notso.company', 'www.notso.company', `www.${SITE_DOMAIN}`];

// TRACKER_SCRIPT_NAME on notsobot.api's analytics-umami container, the same one notsobot.com and nsb.gg load
const UMAMI_SCRIPT_URL = 'https://oasis.notsocompany.com/drink.js';


function escapeAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}


const router = new FetchRouter();

// `wrangler dev` sends requests in as notsocompany.com (the first route's host), so localhost gets the pages too
const site = new DomainRouter(SITE_DOMAIN);
site.route('/:path...', '*', async (event) => {
  const env = event.environment as Env;
  const response = await env.ASSETS.fetch(event.request);
  // the pages are plain built html, so the tracker goes in here rather than at build time, keeping the id in .dev.vars
  if (env.UMAMI_WEBSITE_ID && response.headers.get('content-type')?.startsWith('text/html')) {
    const script = `<script defer data-website-id="${escapeAttribute(env.UMAMI_WEBSITE_ID)}" src="${UMAMI_SCRIPT_URL}"></script>`;
    return new HTMLRewriter()
      .on('head', {element: (head) => { head.append(script, {html: true}); }})
      .transform(response);
  }
  return response;
});
router.addRouter(site);

for (const domain of REDIRECT_DOMAINS) {
  const redirect = new DomainRouter(domain);
  redirect.route('/:path...', '*', (event) => {
    return new ApiRedirect(`https://${SITE_DOMAIN}${event.url.pathname}${event.url.search}`, {status: 301});
  });
  router.addRouter(redirect);
}

// anything else matches no route, which cf-worker-router answers with its 404 ({"code": 0, "message": "Not Found", ...})


export default {
  async fetch(request, env, context): Promise<Response> {
    return router.onFetch(request, env, context);
  },
} satisfies ExportedHandler<Env>;
