require "net/http"
require "json"
require "base64"
require "uri"

# WASM has no socket extension, so SocketError is never defined.
# faraday-net_http references it at class load time.
SocketError = Class.new(StandardError) unless defined?(SocketError)

# OpenSSL is not available in WASM. Stub the module so code that
# references OpenSSL::SSL (e.g. Faraday, Net::HTTP) doesn't crash.
# Actual HTTPS is handled by the browser's native fetch via the JS bridge.
unless defined?(OpenSSL::SSL)
  module OpenSSL
    class OpenSSLError < StandardError; end
    module SSL
      class SSLError < OpenSSLError; end
      VERIFY_NONE = 0
      VERIFY_PEER = 1
      VERIFY_FAIL_IF_NO_PEER_CERT = 2
      VERIFY_CLIENT_ONCE = 4
      OP_ALL = 0x80000BFF
      OP_NO_SSLv2 = 0x01000000
      OP_NO_SSLv3 = 0x02000000
      OP_NO_TLSv1 = 0x04000000

      class SSLContext
        attr_accessor :verify_mode, :cert_store, :min_version, :max_version, :options
        def set_params(**params); self; end
      end

      class SSLSocket
        def initialize(io, ctx = nil); end
        def connect; self; end
        def hostname=(h); end
        def sync_close=(v); end
      end
    end
  end
end

module WasmHTTP
  MESSAGES = {
    200 => "OK", 201 => "Created", 202 => "Accepted", 204 => "No Content",
    301 => "Moved Permanently", 302 => "Found", 303 => "See Other", 304 => "Not Modified",
    307 => "Temporary Redirect", 308 => "Permanent Redirect",
    400 => "Bad Request", 401 => "Unauthorized", 403 => "Forbidden",
    404 => "Not Found", 405 => "Method Not Allowed", 408 => "Request Timeout",
    409 => "Conflict", 422 => "Unprocessable Entity", 429 => "Too Many Requests",
    500 => "Internal Server Error", 502 => "Bad Gateway", 503 => "Service Unavailable",
    504 => "Gateway Timeout"
  }.freeze

  class Connection
    class << self
      attr_accessor :proxy_url, :proxy_hosts
    end

    def request(uri, method: "GET", headers: {}, body: nil)
      target = resolve_proxy(uri.to_s)

      result_js = JS.global[:wasmHttpBridge].fetch(
        target,
        method.to_s,
        headers.to_json,
        body.to_s
      ).await

      result = JSON.parse(result_js.to_s)

      unless result["ok"]
        raise SocketError, "HTTP request failed: #{result["error"]}"
      end

      build_response(result)
    end

    private

    def resolve_proxy(url)
      return url unless self.class.proxy_url

      begin
        host = URI(url).host
      rescue URI::InvalidURIError
        return url
      end
      return url unless host

      if self.class.proxy_hosts&.any? { |h| host == h || host.end_with?(".#{h}") }
        "#{self.class.proxy_url}#{url}"
      else
        url
      end
    end

    def build_response(result)
      status = result["status"]
      klass = Net::HTTPResponse::CODE_TO_OBJ[status.to_s] || Net::HTTPUnknownResponse
      response = klass.new("1.1", status, MESSAGES[status] || "Unknown")
      response.instance_variable_set(:@read, true)

      result["headers"]&.each { |k, v| response[k] = v }

      body = result["binary"] ? Base64.decode64(result["body"]) : result["body"]
      response.instance_variable_set(:@body, body)

      response
    end
  end
end

Net::HTTP.prepend(Module.new do
  def request(req, body = nil, &block)
    req.body = body if body && req.body.nil?

    scheme = use_ssl? ? "https" : "http"
    default_port = use_ssl? ? 443 : 80
    port_str = port == default_port ? "" : ":#{port}"
    uri = "#{scheme}://#{address}#{port_str}#{req.path}"

    headers = {}
    req.each_header { |k, v| headers[k] = v }

    response = WasmHTTP::Connection.new.request(
      uri, method: req.method, headers: headers, body: req.body
    )

    # Faraday's NetHttp adapter passes a block to request() where it
    # calls save_http_response to set env.status. Without yielding,
    # the status is never set and RubyLLM's error middleware fails.
    yield response if block

    response
  end

  def connect; end

  def do_start
    @started = true
    self
  end

  def do_finish
    @started = false
  end
end)

if defined?(Faraday)
  class Faraday::Adapter::WasmHTTP < Faraday::Adapter
    def call(env)
      super
      response = ::WasmHTTP::Connection.new.request(
        env.url.to_s,
        method: env.method.to_s.upcase,
        headers: env.request_headers.to_h,
        body: env.body
      )
      save_response(env, response.code.to_i, response.body) do |resp_headers|
        response.each_header { |k, v| resp_headers[k] = v }
      end
    end
  end

  Faraday::Adapter.register_middleware(wasm_http: Faraday::Adapter::WasmHTTP)
  Faraday.default_adapter = :wasm_http
end
