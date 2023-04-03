# ft_transcendence <img src="./image/barcode.png" width="35px" /> BarcodePong

<div align="center">

![TranDoorGit](./image/TranDoorGit.gif)

</div>

- Last and final 42 project on common course. This project is about creating a website for the Pong contest. Users will play Pong with others. You will enjoy real-time multiplayer online pong games with random match-making, chat room, direct message, changing profiles, 2FA Auth, managing friends list.
- Tech used on this project: **NestJS, NextJS, PostgreSQL**

## <img src="./image/barcode.png" width="25px" /> Subject

[ft_transcendence subject PDF (EN, 2022)](https://github.com/keulee/ft_transcendence/blob/main/subject/ftTranscendence.en.subject.pdf)

## <img src="./image/barcode.png" width="25px" /> Usage

(sudo) **make** : docker-compose up --build
<br>
**make fclean** : delete completely docker container, volume, network, image
<br>
**make re** : fclean all

## <img src="./image/barcode.png" width="25px" /> url

**http://localhost:8000**

## <img src="./image/barcode.png" width="25px" /> BarcodePong API document

You can check swagger API docs on http://localhost:8080/api once you successfully build the docker container

## <img src="./image/barcode.png" width="25px" /> docker volume (postgresql)

You can check the mount point with command line 'docker volume inspect'

## <img src="./image/barcode.png" width="25px" /> if you need to restart the front / back

(from the root where you find docker-compose.yml file)
<br>
For front : **docker restart front**
<br>
For back : **docker restart backend**

## <img src="./image/barcode.png" width="25px" /> Screenshot of BarcodePong

##### First Page
<img src="./image/FirstPage.png" />

##### Home Page
<img src="./image/profilePage.png" />

##### Chat Page
<img src="./image/ChatPage.png" />

##### Create a Chat
<img src="./image/CreateChatPage.png" />

##### Chat at Public room
<img src="./image/ChatingPage.png" />

##### When you access to Private chat room
<img src="./image/PrivateChatPage.png" />

##### DM
<img src="./image/DMPage.png" />

##### Game Page
<img src="./image/GamePage.png" />

##### Loading for searching a random-matching game 
<img src="./image/GameLoadingPage.png" />

##### Game Setting 01 - For player who joined at the queue first (As Game room admin)
<img src="./image/GameSettingPage01.png" />

##### Game Setting 02 - For player who joined at the queue later
<img src="./image/GameSettingPage02.png" />

##### On gaming 01 (with big ball size setting)
<img src="./image/GamingPage.png" />

##### On gaming 02 (with small ball size setting)
<img src="./image/GameWithSmallBall.png" />

##### Game finished
<img src="./image/WhenGameFinished.png" />

##### Setting Page
<img src="./image/SettingPage.png" />

##### Change name
<img src="./image/ChangeName.png" />

##### Change avatar
<img src="./image/ChangeAvatar.png" />

##### 2FA
<img src="./image/2FAAuthPage.png" />

## <img src="./image/barcode.png" width="25px" /> Made by

<p>
   <img src="https://emoji.slack-edge.com/T039P7U66/the-federation/cf19b04ff8baa385.png" width="25px"/><img src="https://img.shields.io/badge/cjung--mo(Jungmoo Cheon)-000000?style=for-the-badge&logoColor=white"/> <a href="https://profile.intra.42.fr/users/cjung-mo"><img src="https://img.shields.io/badge/Intra-000000?style=for-the-badge&logo=42&logoColor=white"/></a> <a href="https://github.com/jmcheon"><img src="https://img.shields.io/badge/Github-181717?style=for-the-badge&logo=Github&logoColor=white"/></a>
  <br>
   <img src="https://emoji.slack-edge.com/T039P7U66/the-federation/cf19b04ff8baa385.png" width="25px"/><img src="https://img.shields.io/badge/eyoo(Eunmi Yoo)-000000?style=for-the-badge&logoColor=white"/> <a href="https://profile.intra.42.fr/users/eyoo"><img src="https://img.shields.io/badge/Intra-000000?style=for-the-badge&logo=42&logoColor=white"/></a> <a href="https://github.com/EunmiYoo"><img src="https://img.shields.io/badge/Github-181717?style=for-the-badge&logo=Github&logoColor=white"/></a>
   <br>
   <img src="https://emoji.slack-edge.com/T039P7U66/the-assembly/157ba128c687991d.png" width="25px"/><img src="https://img.shields.io/badge/hyungyoo (Hyungjun Yoo)-000000?style=for-the-badge&logoColor=white"/> <a href="https://profile.intra.42.fr/users/hyungyoo"><img src="https://img.shields.io/badge/Intra-000000?style=for-the-badge&logo=42&logoColor=white"/></a> <a href="https://github.com/hyungyoo"><img src="https://img.shields.io/badge/Github-181717?style=for-the-badge&logo=Github&logoColor=white"/></a>
  <br>
   <img src="https://emoji.slack-edge.com/T039P7U66/the-order/bc19034a94c85e26.png" width="25px"/><img src="https://img.shields.io/badge/seyun (Seokchan Yun)-000000?style=for-the-badge&logoColor=white"/> <a href="https://profile.intra.42.fr/users/seyun"><img src="https://img.shields.io/badge/Intra-000000?style=for-the-badge&logo=42&logoColor=white"/></a> <a href="https://github.com/zeroet"><img src="https://img.shields.io/badge/Github-181717?style=for-the-badge&logo=Github&logoColor=white"/></a>
  <br>
   <img src="https://emoji.slack-edge.com/T039P7U66/the-order/bc19034a94c85e26.png" width="25px"/><img src="https://img.shields.io/badge/keulee (Keungeun Lee)-000000?style=for-the-badge&logoColor=white"/> <a href="https://profile.intra.42.fr/users/keulee"><img src="https://img.shields.io/badge/Intra-000000?style=for-the-badge&logo=42&logoColor=white"/></a> <a href="https://github.com/keulee"><img src="https://img.shields.io/badge/Github-181717?style=for-the-badge&logo=Github&logoColor=white"/></a>
  <br>
</p>
