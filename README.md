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
