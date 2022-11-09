PS_LIST := $(shell docker ps -a -q)
IMAGE_LIST := $(shell docker image ls)
NETWORK_LIST := $(shell docker volume ls)
VOLUME_LIST := $(shell docker network ls)


all :
	docker-compose up

fclean :
	docker container prune --force 
	docker image prune --force --all
	docker network prune --force 
	docker volume prune --force 
	rm -rf api-db
	mkdir api-db

re : fclean all

.PHONY: all fclean re
