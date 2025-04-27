SUBDIRS = frontend backend

all: $(SUBDIRS)

clean: $(SUBDIRS)
clean: TARGET=clean

distclean: $(SUBDIRS) distclean-root
distclean: TARGET=distclean

distclean-root:
	rm -rf node_modules

dist: $(SUBDIRS)
dist: TARGET=dist

start: build
	make -C backend start

doc:
	plantuml doc/*.puml

check: test
	npx eslint .
	npx prettier --check .

format:
	npx eslint --fix .
	npx prettier --write .

dev:
	npx concurrently \
		--kill-others \
		--names "WEB,API" \
		--prefix-colors "bgMagenta.bold,bgGreen.bold" \
		$(foreach dir,$(SUBDIRS),"$(MAKE) -C $(dir) dev")

test: prepare
	npx vitest run

watch: prepare
	npm test

coverage: prepare
	npx vitest --coverage

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

$(SUBDIRS): force
	@$(MAKE) -C $@ $(TARGET)

force: ;

.PHONY: all clean distclean distclean-root dist start doc \
	check format \
	dev test watch coverage unit-tests integration-tests e2e-tests \
	build prepare version
