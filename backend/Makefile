all: dist check

clean:
	rm -rf dist
	rm -rf testdata

distclean: clean
	rm -rf node_modules

dist: build

start: build
	npm start

check: test

format:

dev: build
	npx nest start --watch

test: prepare
	npx vitest run

watch: prepare
	npm test

coverage: prepare
	npx vitest --coverage

unit-tests: prepare
	npx vitest run --testPathPattern=".*\/unit\/.*"

integration-tests: prepare
	npx vitest run --testPathPattern=".*\/integration\/.*"

e2e-tests: prepare
	npx vitest run --testPathPattern=".*\/e2e\/.*"

build: prepare
	npm run build

prepare: version

version:

.PHONY: all clean distclean dist start \
	check format \
	dev test watch coverage unit-tests integration-tests e2e-tests \
	build prepare version
