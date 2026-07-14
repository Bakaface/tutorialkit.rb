# Put all the code required to initialize the Rails Wasm environment

# Common Rails shims
require "wasmify/rails/shim"

# Load Rails patches
require "wasmify/rails/patches"

# Setup external commands
require "wasmify/external_commands"

# Patch Bundler.require to require a precomputed gem list — there is no
# runtime gem resolution in WASM. The list is generated from ruby-wasm/Gemfile
# by pack-gems (/rails-vm/boot_requires.rb); the inline list is a fallback
# for binaries packed by the legacy monolithic pipeline (bin/build-wasm).
def Bundler.require(*groups)
  gem_names =
    if File.exist?("/rails-vm/boot_requires.rb")
      Kernel.load "/rails-vm/boot_requires.rb" unless defined?(WASM_BOOT_REQUIRES)
      WASM_BOOT_REQUIRES
    else
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
      ]
    end

  gem_names.each do |gem_name|
    Kernel.require gem_name
  rescue LoadError
    # Mirror Bundler.require's fallback: tzinfo-data → tzinfo/data
    raise unless gem_name.include?("-")

    Kernel.require gem_name.tr("-", "/")
  end
end
