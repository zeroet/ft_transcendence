# ft_transcendence

## Usage

(sudo) **make** : docker-compose
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
