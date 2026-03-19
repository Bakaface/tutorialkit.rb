interface Env {
  ALLOWED_HOSTS: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders(request),
      });
    }

    // Extract target URL from query string: /proxy?https://api.example.com/data
    const url = new URL(request.url);
    const targetUrl = url.search.slice(1); // Remove leading '?'

    if (!targetUrl) {
      return new Response(JSON.stringify({ error: 'Missing target URL. Usage: /proxy?https://api.example.com/path' }), {
        status: 400,
        headers: { 'content-type': 'application/json', ...corsHeaders(request) },
      });
    }

    // Validate target URL
    let target: URL;
    try {
      target = new URL(targetUrl);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid target URL' }), {
        status: 400,
        headers: { 'content-type': 'application/json', ...corsHeaders(request) },
      });
    }

    // Check allowed hosts
    if (env.ALLOWED_HOSTS) {
      const allowed = env.ALLOWED_HOSTS.split(',').map(h => h.trim()).filter(Boolean);
      if (allowed.length > 0 && !allowed.some(h => target.hostname === h || target.hostname.endsWith(`.${h}`))) {
        return new Response(JSON.stringify({ error: `Host ${target.hostname} is not allowed` }), {
          status: 403,
          headers: { 'content-type': 'application/json', ...corsHeaders(request) },
        });
      }
    }

    // Forward the request
    const headers = new Headers(request.headers);
    headers.delete('host');
    headers.delete('origin');
    headers.delete('referer');

    try {
      const response = await fetch(targetUrl, {
        method: request.method,
        headers,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      });

      // Return response with CORS headers
      const responseHeaders = new Headers(response.headers);
      for (const [k, v] of Object.entries(corsHeaders(request))) {
        responseHeaders.set(k, v);
      }

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: `Proxy error: ${(err as Error).message}` }), {
        status: 502,
        headers: { 'content-type': 'application/json', ...corsHeaders(request) },
      });
    }
  },
};

function corsHeaders(request: Request): Record<string, string> {
  return {
    'access-control-allow-origin': request.headers.get('origin') || '*',
    'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'access-control-allow-headers': request.headers.get('access-control-request-headers') || '*',
    'access-control-max-age': '86400',
  };
}
