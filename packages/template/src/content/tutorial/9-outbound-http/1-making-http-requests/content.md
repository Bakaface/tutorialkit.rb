---
type: lesson
title: "Making HTTP Requests"
focus: /workspace/app/controllers/http_demo_controller.rb
previews: [3000]
mainCommand: ['node scripts/rails.js server', 'Starting Rails server']
prepareCommands:
  - ['npm install', 'Preparing Ruby runtime']
  - ['node scripts/rails.js db:prepare', 'Prepare database']
custom:
  shell:
    workdir: '/workspace'
---

# Making Outbound HTTP Requests from Rails

Ruby on Rails running in WebAssembly can make **outbound HTTP requests** to external APIs — just like a normal Rails app. This lesson shows how it works.

## How it works

```
Ruby Net::HTTP  ->  JS fetch bridge  ->  CORS proxy  ->  External API
```

Since the Rails app runs inside your browser, outbound requests go through the browser's `fetch()` API. Most server APIs don't include CORS headers, so a **CORS proxy** is needed to relay requests.

The HTTP bridge automatically intercepts `Net::HTTP` calls (and anything built on top of it, like Faraday) and routes them through the proxy.

## Deploy your own CORS proxy

This tutorial includes a ready-to-deploy Cloudflare Worker that acts as a CORS proxy. You'll find it in the `cors-proxy/` directory of this project's source code.

### Steps

1. **Install Wrangler** (Cloudflare's CLI):

   ```bash
   npm install -g wrangler
   wrangler login
   ```

2. **Navigate to the proxy directory** in the tutorialkit.rb source:

   ```bash
   cd packages/template/cors-proxy
   ```

3. **Edit `wrangler.toml`** to set your allowed hosts:

   ```toml
   [vars]
   ALLOWED_HOSTS = "httpbin.org,api.example.com"
   ```

   This is a comma-separated list of hostnames the proxy will forward requests to. Keep it restrictive — only add hosts your tutorial lessons actually need.

4. **Deploy**:

   ```bash
   npm install
   wrangler deploy
   ```

   Wrangler will print your worker URL, e.g. `https://cors-proxy.<your-subdomain>.workers.dev`.

## Try it out

1. Open `http_demo_controller.rb` in the editor and replace `YOUR-SUBDOMAIN` in `PROXY_URL` with your actual Cloudflare Workers subdomain
2. Click **Fetch from httpbin.org** to make an outbound GET request
3. Click **Post to httpbin.org** to make an outbound POST request

The proxy configuration lives at the top of the controller as constants. Since the controller is reloaded on each request, you can edit `PROXY_URL` and your changes take effect immediately — no server restart needed.

## The code

**Controller** (`http_demo_controller.rb`): Configures the CORS proxy via a `before_action`, then makes outbound requests using `Net::HTTP` — the same standard library you'd use in any Rails app.

```ruby
PROXY_URL = "https://cors-proxy.<your-subdomain>.workers.dev/proxy?"
PROXY_HOSTS = ["httpbin.org"]

before_action :configure_proxy

def fetch_get
  uri = URI("https://httpbin.org/get")
  response = Net::HTTP.get_response(uri)
  render json: { status: response.code.to_i, body: JSON.parse(response.body) }
end
```

The `configure_proxy` callback sets `WasmHTTP::Connection.proxy_url` and `proxy_hosts` before each request, so the HTTP bridge knows which hosts to route through the proxy.

**View** (`http_demo/index.html.erb`): Buttons trigger requests and the JSON response is displayed in a `<pre>` block.

:::note
Responses are synchronous — the browser waits for the full response before rendering. This is because the Ruby WASM runtime processes requests through a single-threaded queue.
:::
