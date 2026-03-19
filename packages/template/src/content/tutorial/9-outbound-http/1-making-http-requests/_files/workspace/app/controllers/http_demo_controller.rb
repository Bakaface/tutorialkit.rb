require "net/http"
require "json"

class HttpDemoController < ApplicationController
  # ── CORS proxy configuration ─────────────────────────────────
  # Deploy your own Cloudflare Worker (see cors-proxy/ in the
  # project source), then paste your worker URL below.
  #
  # The proxy is needed because most APIs don't set CORS headers,
  # and this Rails app runs inside the browser.
  PROXY_URL = "https://cors-proxy.YOUR-SUBDOMAIN.workers.dev/proxy?"
  PROXY_HOSTS = ["httpbin.org"]
  # ─────────────────────────────────────────────────────────────

  before_action :configure_proxy

  def index
  end

  def fetch_get
    uri = URI("https://httpbin.org/get?tutorial=rails-wasm&lesson=outbound-http")
    response = Net::HTTP.get_response(uri)

    render json: {
      status: response.code.to_i,
      headers: response.each_header.to_h,
      body: safe_parse_json(response.body)
    }
  rescue => e
    render json: { error: "#{e.class}: #{e.message}" }, status: 500
  end

  def fetch_post
    uri = URI("https://httpbin.org/post")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri.path)
    request["Content-Type"] = "application/json"
    request.body = { message: "Hello from Rails WASM!", timestamp: Time.now.iso8601 }.to_json

    response = http.request(request)

    render json: {
      status: response.code.to_i,
      headers: response.each_header.to_h,
      body: safe_parse_json(response.body)
    }
  rescue => e
    render json: { error: "#{e.class}: #{e.message}" }, status: 500
  end

  private

  def configure_proxy
    WasmHTTP::Connection.proxy_url = PROXY_URL
    WasmHTTP::Connection.proxy_hosts = PROXY_HOSTS
  end

  def safe_parse_json(str)
    JSON.parse(str)
  rescue JSON::ParserError
    str
  end
end
