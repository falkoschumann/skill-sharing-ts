# TODO Replace jest with vitest
# TODO Move up vitest

SUBDIRS = frontend backend

all: $(SUBDIRS) root

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

root: check-root

doc:
	plantuml doc/*.puml

check: $(SUBDIRS) check-root
check: TARGET=check

check-root:
	npx eslint .
	npx prettier --check .

format: $(SUBDIRS) format-root
format: TARGET=format

format-root:
	npx eslint --fix .
	npx prettier --write .

dev:
	npx concurrently \
		--kill-others \
		--names "WEB,API" \
		--prefix-colors "bgMagenta.bold,bgGreen.bold" \
		$(foreach dir,$(SUBDIRS),"$(MAKE) -C $(dir) dev")

test: $(SUBDIRS)
test: TARGET=test

build: prepare $(SUBDIRS)
build: TARGET=build

version: $(SUBDIRS)
version: TARGET=version

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
