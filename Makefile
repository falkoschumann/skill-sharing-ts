WORKSPACES=backend frontend

all: dist check

clean:
	npm run clean --workspaces --if-present
	npm run clean

distclean: clean
	npm run distclean --workspaces --if-present
	npm run distclean

dist: build
	npm run dist --workspaces --if-present
	mkdir -p dist/static
	cp -R backend/dist/main.js dist/main.cjs
	cp -R frontend/dist/* dist/static

start: build
	npm start

doc:
	plantuml doc/*.puml

check: test
	npx eslint .
	npx prettier --check .

format:
	npx eslint --fix .
	npx prettier --write .

dev: build
	npx concurrently \
		--kill-others \
		--names "WEB,API" \
		--prefix-colors "bgMagenta.bold,bgGreen.bold" \
		$(foreach workspace,$(WORKSPACES),"npm run dev --workspace=$(workspace)")

test: build
	npx vitest run

watch: build
	npm test

coverage: build
	npx vitest run --coverage

unit-tests: build
	npx vitest run unit

integration-tests: build
	npx vitest run integration

e2e-tests: build
	npx vitest run e2e

build: prepare
	npm run build --workspaces --if-present

prepare: version
	@if [ -n "$(CI)" ] ; then \
		echo "CI detected, run npm ci"; \
		npm ci; \
	else \
		npm install; \
	fi

version:
	@echo "Use Node.js $(shell node --version)"
	@echo "Use NPM $(shell npm --version)"

.PHONY: all clean distclean dist start doc \
	check format \
	dev test watch coverage unit-tests integration-tests e2e-tests \
	build prepare version
