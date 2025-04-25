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
	npx eslint .

format:
	npx eslint --fix .

dev: build
	npx nest start --watch

test: prepare
	npm test

watch: prepare
	npx jest --watch

coverage: prepare
	npx jest --coverage

unit-tests: prepare
	npx jest --testPathPattern=".*\/unit\/.*"

integration-tests: prepare
	npx jest --testPathPattern=".*\/integration\/.*"

e2e-tests: prepare
	npx jest --testPathPattern=".*\/e2e\/.*"

build: prepare
	npm run build

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

.PHONY: all clean distclean dist start \
	check format \
	dev test watch coverage unit-tests integration-tests e2e-tests \
	build prepare version
