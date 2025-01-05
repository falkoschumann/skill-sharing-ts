# Possible values: major, minor, patch or concrete version
VERSION = minor

all: dist check

clean:
	@echo "Cleaning up..."
	@rm -rf coverage

distclean: clean
	@echo "Cleaning up distribution..."
	@rm -rf dist
	@rm -rf node_modules

dist: build
	@echo "Creating distribution..."

release: all
	@echo "Creating release $(VERSION)..."
	@npm version $(VERSION) -m "chore: create release v%s"
	@git push
	@git push --tags

start: build
	@echo "Starting..."
	@deno run api/main.ts

check: test
	@echo "Checking code..."
	@deno fmt --check
	@deno lint

format:
	@echo "Formatting code..."
	@deno fmt
	@deno lint --fix

dev:
	@echo "Starting development server..."
	@deno task dev

test: prepare
	@echo "Testing..."
	@deno test

unit-tests: prepare
	@echo "Running unit tests..."
	@deno test test/unit

integration-tests: prepare
	@echo "Running integration tests..."
	@deno test test/integration

e2e-tests: prepare
	@echo "Running end-to-end tests..."
	@deno test test/e2e

watch: prepare
	@echo "Testing with watch..."
	@deno test --watch

coverage: prepare
	@echo "Testing with coverage..."
	@deno test --coverage
	@deno coverage

coverage-detailed: prepare
	@echo "Testing with coverage..."
	@deno test --coverage
	@deno coverage --detailed

build: prepare
	@echo "Building..."
	@deno task build

prepare: version
	@echo "Preparing..."
	@deno install

version:
	@echo "Using Deno version $(shell deno --version)"

.PHONY: all clean distclean dist \
	release start \
	check format \
	dev test unit-tests integration-tests e2e-tests watch coverage \
	build prepare version
