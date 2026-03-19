# CORS Proxy for TutorialKit.rb

A minimal Cloudflare Worker that proxies HTTP requests and adds CORS headers. Use this when your tutorial needs to call APIs that don't include CORS headers in their responses.

## Usage

Target URL is passed as the query string:

```
GET https://your-proxy.workers.dev/proxy?https://api.example.com/data
POST https://your-proxy.workers.dev/proxy?https://api.example.com/submit
```

## Setup

```bash
cd cors-proxy
npm install
```

## Development

```bash
npm run dev
```

## Deployment

### Manual

```bash
npx wrangler login   # one-time Cloudflare auth
npm run deploy
```

### GitHub Actions

The repository includes a `deploy-cors-proxy` workflow (manual trigger). It requires two repository secrets:

- `CLOUDFLARE_API_TOKEN` — API token with Workers write permissions
- `CLOUDFLARE_ACCOUNT_ID` — your Cloudflare account ID

## Configuration

Set `ALLOWED_HOSTS` in `wrangler.toml` or via `wrangler secret` to restrict which target hosts can be proxied:

```toml
[vars]
ALLOWED_HOSTS = "api.example.com,api.openai.com"
```

Leave empty to allow all hosts.

## Connecting to Your Tutorial

In a Rails initializer or environment config:

```ruby
WasmHTTP::Connection.proxy_url = "https://your-proxy.workers.dev/proxy?"
WasmHTTP::Connection.proxy_hosts = ["api.example.com", "api.openai.com"]
```

Requests to matching hosts will be routed through the proxy. All other requests go direct.
