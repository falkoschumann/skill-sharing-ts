WORKSPACES=backend frontend
PLANTUML_FILES = $(wildcard doc/*.puml)
DIAGRAM_FILES = $(subst .puml,.png,$(PLANTUML_FILES))

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

dev: build
	npx concurrently \
		--kill-others \
		--names "WEB,API" \
		--prefix-colors "bgMagenta.bold,bgGreen.bold" \
		$(foreach workspace,$(WORKSPACES),"npm run dev --workspace=$(workspace)")

doc: $(DIAGRAM_FILES)

check: test
	npx eslint .
	npx prettier --check .

format:
	npx eslint --fix .
	npx prettier --write .

test: build
	npx vitest run

watch: build
	npx vitest watch

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

$(DIAGRAM_FILES): %.png: %.puml
	plantuml $^

.PHONY: all clean distclean dist \
	start dev doc \
	check format \
	test watch coverage unit-tests integration-tests e2e-tests \
	build prepare version
