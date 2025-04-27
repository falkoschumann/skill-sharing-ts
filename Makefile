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

build: prepare $(SUBDIRS)
build: TARGET=build

$(SUBDIRS): force
	@$(MAKE) -C $@ $(TARGET)

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

force: ;

.PHONY: all clean distclean dist start root doc \
	check check-root format format-root \
	dev test \
	build prepare version
