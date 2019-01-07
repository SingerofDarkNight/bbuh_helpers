dev: clean_dist build

install_deps:
	yarn

build:
	yarn run build

clean_dist:
	rm -rf dist/

clean:
	rm -rf dist/
	rm -rf node_modules/
