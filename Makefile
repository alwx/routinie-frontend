VERSION = 17
IMAGE_NAME = alwxdev/routinie-frontend:$(VERSION)

build-frontend:
	docker build --platform linux/amd64 --rm -t $(IMAGE_NAME) -f ./deployments/Dockerfile .
	docker push $(IMAGE_NAME)
