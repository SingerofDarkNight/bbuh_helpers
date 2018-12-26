dev: clean_dist build

dist: install_deps build

install_deps:
	cd src && yarn

build:
	cd src && yarn run build
	mkdir dist
	cp src/manifest.json dist/
	cp -R src/html dist/
	cp -R src/icons dist/
	cp -R src/js dist/
	rm dist/js/encoding_page.source.js

clean_dist:
	rm -rf dist/

clean:
	rm -rf dist/
	rm -rf src/node_modules
	rm src/js/encoding_page.js
