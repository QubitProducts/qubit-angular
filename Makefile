BIN = ./node_modules/.bin

.PHONY: build start clean lint

start:
	@cd demo && npm start

test: lint

lint:
	@$(BIN)/tslint --type-check -p tsconfig.json -c tslint.json

build: lint
	@$(BIN)/tsc
	@cp package.json ./dist/package.json
	@cp package-lock.json ./dist/package-lock.json
	@cp README.md ./dist/README.md

clean:
	@rm -rf dist
