# Patch Rails app generator for WASM compatibility
# 1. Use pglite as database adapter
# 2. Skip git commands (backticks don't work in WASM)
# 3. Skip chmod (not implemented in WASI)
# 4. Generate Gemfile matching tarball gems

# Patch FileUtils.chmod to be a no-op (WASI doesn't support chmod)
module FileUtils
  class << self
    def chmod(*args); end
    def chmod_R(*args); end
  end
end

Wasmify::Patcha.on_load("Rails::Generators::AppBase") do
  Rails::Generators::AppBase.prepend(Module.new do
    # Skip shell command execution - return "main" as default branch
    def user_default_branch
      "main"
    end
  end)
end

Wasmify::Patcha.on_load("Rails::AppBuilder") do
  Rails::AppBuilder.prepend(Module.new do
    # Copy Gemfile and Gemfile.lock from extracted tarball
    # The tarball is the single source of truth for available gems
    def gemfile
      gems_base = "/gems"  # Mounted from extracted tarball

      gemfile_src = File.join(gems_base, "Gemfile")
      lockfile_src = File.join(gems_base, "Gemfile.lock")

      if File.exist?(gemfile_src)
        create_file "Gemfile", File.read(gemfile_src)
      else
        raise "Gemfile not found in gems tarball at #{gemfile_src}"
      end

      if File.exist?(lockfile_src)
        create_file "Gemfile.lock", File.read(lockfile_src)
      else
        raise "Gemfile.lock not found in gems tarball at #{lockfile_src}"
      end
    end

    def database_yml
      create_file "config/database.yml" do
        <<-YAML
default: &default
  adapter: pglite
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  timeout: 5000

development:
  <<: *default
  database: store_development

# Warning: The database defined as "test" will be erased and
# re-generated from your development database when you run "rake".
# Do not set this db to the same as development or production.
test:
  <<: *default
  database: store_test

production:
  primary:
    <<: *default
    # database: path/to/persistent/storage/production.sqlite3
  cache:
    <<: *default
    # database: path/to/persistent/storage/production_cache.sqlite3
    migrations_paths: db/cache_migrate
  queue:
    <<: *default
    # database: path/to/persistent/storage/production_queue.sqlite3
    migrations_paths: db/queue_migrate
  cable:
    <<: *default
    # database: path/to/persistent/storage/production_cable.sqlite3
    migrations_paths: db/cable_migrate
        YAML
      end
    end
  end)
end
