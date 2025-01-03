all: dist check

clean:
	@echo "Cleaning up..."

distclean: clean
	@echo "Cleaning up distribution..."
	@rm -rf dist
	@rm -rf node_modules

dist: build
	@echo "Creating distribution..."

dev:
	@echo "Starting development server..."
	@deno run --allow-env --allow-ffi --allow-net --allow-read --allow-run --allow-sys --allow-write npm:vite

build: version prepare
	@echo "Building..."
	@deno task build

check: test
	@echo "Checking code..."
	@deno fmt --check
	@deno lint

format:
	@echo "Formatting code..."
	@deno fmt
	@deno lint --fix

test:
	@echo "Testing..."

version:
	@echo "Using Deno version $(shell deno --version)"

prepare:
	@echo "Preparing..."
	@deno install
