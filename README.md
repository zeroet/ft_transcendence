# ft_transcendence

# 추가해야할 사항
friend:

    - 추가된 친구가 이름변경시 그 친구를 친구추가한 사용자의 친구목록에서 친구이름이 업데이트되지 않음 
    
chat: 

    - 방정보 비번 변경시 방장이 비번이 변경됐는지 알 수 있게
    - 비번방 입장시 비번 입력 별(*)로 표시
    - 디엠 읽지않은 문자수 표시

# Barcodepong API 문서

서버 실행하고 해당 url 들어가면 swagger api 문서 볼 수 있습니다.
http://localhost:8080/api

# Makefile : 처음빼면 다시 하실필요없습니다.

make : docker-compose
make fclean : container, volume, network, image 모두삭제
make re: fclean all

# docker volume (postgresql)

이거는 docker volume inspect 로 찾아서 보시면 어디에 마운트되는지나옵니다!

# 프론트 개발

front 폴더에 nginx폴더있음
localhost:8000 으로 들어가면 프론트나옴 : 로그인구현중이라 기달
localhost:8000/Home 으로들어가면 Home나옴

# 백엔드

backend에 nestjs 폴더있음
localhost:8080 으로

# 만약에 프론트나 백이나 도커를 껏다가 켜야한다면

프론트 : docker restart front
백 : docker restart backend
하시면 됩니다.
다시 docker-compose up 하실필요 없습니다!
