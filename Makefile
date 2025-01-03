all: dist check

clean:
	@echo "Cleaning up..."

distclean: clean
	@echo "Cleaning up distribution..."
	rm -rf node_modules
	rm -rf packages/*/node_modules

dist: build
	@echo "Creating distribution..."

build: version
	@echo "Building..."

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
