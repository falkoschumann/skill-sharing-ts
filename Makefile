WORKSPACES=backend frontend

# TODO extract shared library with output tracker and SSE client
# TODO extract shared library with domain interfaces
# TODO let backend serves frontend
# TODO implement e2e test with frontend and backend

all: dist check

clean:
	npm run clean --workspaces --if-present
	npm run clean

distclean: clean
	npm run distclean --workspaces --if-present
	npm run distclean

dist: build
	npm run dist --workspaces --if-present
	mkdir -p dist
	cp -R backend/dist/* dist/

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

dev: prepare
	npx concurrently \
		--kill-others \
		--names "WEB,API" \
		--prefix-colors "bgMagenta.bold,bgGreen.bold" \
		$(foreach workspace,$(WORKSPACES),"npm run dev --workspace=$(workspace)")

test: prepare
	npx vitest run

watch: prepare
	npm test

coverage: prepare
	npx vitest run --coverage

unit-tests: prepare
	npx vitest run unit

integration-tests: prepare
	npx vitest run integration

e2e-tests: prepare
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
