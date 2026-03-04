# Boot the Rails WASM environment (hybrid wasi-vfs approach).
#
# This file is packed into the WASM binary at /gems/boot.rb via wasi-vfs.
# It sets up Bundler to load gems from /gems/ (the VFS mount point),
# then loads wasmify-rails shims and patches.

ENV["BUNDLE_GEMFILE"] = "/gems/Gemfile"
ENV["BUNDLE_PATH"]    = "/gems/bundle"
ENV["BUNDLE_WITHOUT"] = "development:test"

require "bundler/setup"

# Prevent wasmify/rails/shim from calling nonexistent /bundle/setup.
# The shim (line 16) does `require "/bundle/setup"` which only exists in the
# monolithic binary. Since we already ran bundler/setup above, just mark it loaded.
$LOADED_FEATURES << "/bundle/setup"

require "wasmify/rails/shim"
require "wasmify/rails/patches"
require "wasmify/external_commands"

# Patch Bundler.require to only require precompiled deps.
# (We don't want to deal with group: :wasm here)
def Bundler.require(*groups)
  %w[
    rails
    wasmify-rails
    propshaft
    importmap-rails
    turbo-rails
    stimulus-rails
    jbuilder
    bcrypt
    solid_cache
    solid_queue
    solid_cable
    image_processing
    tzinfo/data
  ].each do |gem_name|
    Kernel.require gem_name
  end
end
