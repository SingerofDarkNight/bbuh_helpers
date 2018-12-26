dist: build
	mkdir dist
	cp src/manifest.json dist/
	cp -R src/html dist/
	cp -R src/icons dist/
	cp -R src/js dist/
	rm dist/js/encoding_page.source.js


install_deps:
	cd src && yarn


build: install_deps
	cd src && yarn run build


clean:
	rm -rf dist/
	rm -rf src/node_modules
	rm src/js/encoding_page.js
