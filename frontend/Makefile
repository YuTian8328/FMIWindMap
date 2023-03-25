PROJECT_NAME=frontend
DEV_IMAGE_NAME=$(PROJECT_NAME)-dev
DEV_CONTAINER_NAME=$(PROJECT_NAME)-dev-container
PROD_IMAGE_NAME=$(PROJECT_NAME)
PROD_CONTAINER_NAME=$(PROJECT_NAME)-container

.PHONY: dev-build, dev-run, dev-stop, prod-build, prod-run, prod-stop

dev-build:
	docker build -t $(DEV_IMAGE_NAME) -f Dockerfile.dev .

dev-run:
	docker run --rm --name $(DEV_CONTAINER_NAME) -p 3000:3000 -v $(shell pwd)/src/:/app/src/ -v $(shell pwd)/public/:/app/public/ -v $(shell pwd)/.env:/app/.env $(DEV_IMAGE_NAME)

dev-stop:
	docker stop $(DEV_CONTAINER_NAME)

prod-build:
	docker build -t $(PROD_IMAGE_NAME) .

prod-run:
	docker run --rm --name $(PROD_CONTAINER_NAME) -p 80:80 $(PROD_IMAGE_NAME)

prod-stop:
	docker stop $(PROD_CONTAINER_NAME)
