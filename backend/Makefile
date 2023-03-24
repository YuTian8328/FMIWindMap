PROJECT_NAME=backend
DEV_IMAGE_NAME=$(PROJECT_NAME)-dev
DEV_CONTAINER_NAME=$(PROJECT_NAME)-dev-container

.PHONY: build, run, stop

build:
	docker build -t $(DEV_IMAGE_NAME) -f Dockerfile.dev .

run:
	docker run --rm --name $(DEV_CONTAINER_NAME) -p 8000:8000 -v $(shell pwd):/app $(DEV_IMAGE_NAME)

stop:
	docker stop $(DEV_CONTAINER_NAME)
