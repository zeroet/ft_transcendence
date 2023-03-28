# ft_transcendence

<div align="center">

![TranDoorGit](./image/TranDoorGit.gif)

</div>

- Last and final 42 project on common course. This project is about creating a website for the Pong contest. Users will play Pong with others. You will enjoy real-time multiplayer online pong games with random match-making, chat room, direct message, changing profiles, 2FA Auth, managing friends list.
- Tech used on this project: **NestJS, NextJS, PostgreSQL**

## Usage

(sudo) **make** : docker-compose up --build
<br>
**make fclean** : delete completely docker container, volume, network, image
<br>
**make re** : fclean all

## url

**http://localhost:8000**

## Barcodepong API document

You can check swagger API docs on http://localhost:8080/api once you successfully build the docker container

## docker volume (postgresql)

You can check the mount point with command line 'docker volume inspect'

## if you need to restart the front / back

(from the root where you find docker-compose.yml file)
<br>
For front : **docker restart front**
<br>
For back : **docker restart backend**

## Made by
<p>
   <img src="https://emoji.slack-edge.com/T039P7U66/the-assembly/157ba128c687991d.png" width="25px"/><img src="https://img.shields.io/badge/hyungyoo (Hyungjun Yoo)-000000?style=for-the-badge&logoColor=white"/> <a href="https://profile.intra.42.fr/users/hyungyoo" target="_black"><img src="https://img.shields.io/badge/Intra-000000?style=for-the-badge&logo=42&logoColor=white"/></a> <a href="github.com/hyungyoo" traget="_black"><img src="https://img.shields.io/badge/Github-181717?style=for-the-badge&logo=Github&logoColor=white"/></a>
  <br>
  <img src="https://img.shields.io/badge/keulee (Keungeun Lee)-000000?style=for-the-badge&logo=42&logoColor=white"/>
  <br>
  <img src="https://img.shields.io/badge/seyun (Seokchan Yun)-000000?style=for-the-badge&logo=42&logoColor=white"/>
  <br>
  <img src="https://img.shields.io/badge/cjung--mo (Jungmoo Cheon)-000000?style=for-the-badge&logo=42&logoColor=white"/>
  <br>
  <img src="https://img.shields.io/badge/eyoo (Eunmi Yoo)-000000?style=for-the-badge&logo=42&logoColor=white"/>
</p>
