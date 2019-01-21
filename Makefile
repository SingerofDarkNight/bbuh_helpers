DEV_ENV=

dev: DEV_ENV=development
dev: build

dist: DEV_ENV=production
dist: clean install_deps build

install_deps:
	yarn install

build:
	NODE_ENV=$(DEV_ENV) yarn run build

clean_dist:
	rm -rf dist/

clean:
	rm -rf dist/
	rm -rf node_modules/

.PHONY: clean_dist clean build
