dev: clean_dist build

dist: clean install_deps build

install_deps:
	yarn

build:
	yarn run build

clean_dist:
	rm -rf dist/

clean:
	rm -rf dist/
	rm -rf node_modules/
