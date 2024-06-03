build:
	@go build -o bin/cow-templates

run: build
	@./bin/cow-templates

test:
	@go test ./...


clean:
	@rm -rf bin/cow-templates

.PHONY: run test clean


swag:
	@swag init -g internal/app/app.go

lint:
	@golangci-lint run

dep:
	@go mod download

.PHONY: dep

vet:
	@go vet ./...

air:
	@air 


up-compose:
	@docker-compose up -d

down-compose:
	@docker-compose down

.PHONY: up-compose down-compose