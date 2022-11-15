# ft_transcendence

# Makefile : 처음빼면 다시 하실필요없습니다.
make : docker-compose
make fclean : container, volume, network, image 모두삭제
make re: fclean all

# docker volume (postgresql)
이거는 docker volume inspect 로 찾아서 보시면 어디에 마운트되는지나옵니다!


# 프론트 개발
front 폴더에 nginx폴더있음
localhost:8000 으로 들어가면 프론트나옴

# 백엔드
backend에 nestjs 폴더있음
localhost:8080 으로 


# 만약에 프론트나 백이나 도커를 껏다가 켜야한다면

프론트 :  docker restart front
백 :  docker restart backend
하시면 됩니다.
다시  docker-compose up  하실필요 없습니다!