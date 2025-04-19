SUBDIRS = frontend backend
ROOT_FILES = .github/ doc/ README.md

all: $(SUBDIRS) root

clean: $(SUBDIRS)
clean: TARGET=clean

distclean: $(SUBDIRS)
distclean: TARGET=distclean

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
	npx prettier --check $(ROOT_FILES)

format: $(SUBDIRS) format-root
format: TARGET=format

format-root:
	npx prettier --write $(ROOT_FILES)

dev:
	npx concurrently \
		--kill-others \
		--names "WEB,API" \
		--prefix-colors "bgMagenta.bold,bgGreen.bold" \
		$(foreach dir,$(SUBDIRS),"$(MAKE) -C $(dir) dev")

test: $(SUBDIRS)
test: TARGET=test

build: $(SUBDIRS)
build: TARGET=build

version: $(SUBDIRS)
version: TARGET=version

$(SUBDIRS): force
	@$(MAKE) -C $@ $(TARGET)

force: ;

.PHONY: all clean distclean dist start root doc \
	check check-root format format-root \
	dev test \
	build version
