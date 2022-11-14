# ft_transcendence
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