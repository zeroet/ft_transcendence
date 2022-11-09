# ft_transcendence
make : docker-compose
make fclean : container, volume, network, image 모두삭제
make re: fclean all

# docker volume (postgresql)
이거는 docker volume inspect 로 찾아서 보시면 어디에 마운트되는지나옵니다!