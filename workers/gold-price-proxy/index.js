/**
 * Cloudflare Worker – Gold Price Proxy
 *
 * Proxies requests to goldprice.org API with the correct headers
 * so the static site doesn't get 403 Forbidden.
 *
 * Deploy: npx wrangler deploy (from this directory)
 */

const UPSTREAM = 'https://data-asg.goldprice.org/dbXRates/IDR';

// Only allow requests from our own domain (and localhost for dev)
const ALLOWED_ORIGINS = [
  'https://sentralemas.com',
  'https://www.sentralemas.com',
  'http://localhost:3000',
  'http://localhost:8080',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:8080',
];

function isAllowedOrigin(origin) {
  if (!origin) return false;
  // Allow any localhost/127.0.0.1/IPv6 loopback port for development
  if (/^https?:\/\/(localhost|127\.0\.0\.1|\[::1?\])(:\d+)?$/.test(origin)) return true;
  return ALLOWED_ORIGINS.some(
    (allowed) => origin === allowed || origin.startsWith(allowed)
  );
}

export default {
  async fetch(request) {
    // Handle CORS pre-flight
    if (request.method === 'OPTIONS') {
      return handleCORS(request);
    }

    // Only allow GET
    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405 });
    }

    const origin = request.headers.get('Origin') || '';

    // Origin check (skip in dev / direct access)
    const corsOrigin = isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];

    try {
      const upstream = await fetch(UPSTREAM, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'dnt': '1',
          'origin': 'https://goldprice.org',
          'referer': 'https://goldprice.org/',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
          'user-agent':
            'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1',
        },
      });

      const body = await upstream.text();

      return new Response(body, {
        status: upstream.status,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': corsOrigin,
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: 'Upstream request failed', detail: err.message }),
        {
          status: 502,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': corsOrigin,
          },
        }
      );
    }
  },
};

function handleCORS(request) {
  const origin = request.headers.get('Origin') || '';
  const corsOrigin = isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];

  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
