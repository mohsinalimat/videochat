[![Build Status](https://github.com/nkonev/videochat/workflows/CI%20jobs/badge.svg)](https://github.com/nkonev/videochat/actions)

# Videochat
Your self-hosted videoconference platform.

[![Chat image](./.screenshots/2_chat_participants_management_crop.png)](./screenshots.md)

# Key features:
* Well-integrated video calls into entire platform UI, no separated video rooms, text chats, etc...
* No installation on client PC - only modern browser with video camera or microphone required.
* Muting, kicking video participants.
* Calling to user to invite his or her to video conference.
* User is speaking indication.
* File sharing.
* Tet-a-tet private chats for two.
* Horizontal scaling particular video rooms (chats) by servers.
* Horizontal scaling other microservices.
* Supports login through OpedID Connect providers: Facebook, VK.com, Google, Keycloak. Not required can be disabled.
* Internationalization: English and Russian UI.
* Firewall friendly: single port for WebRTC.
* Simple setup with docker swarm or docker-compose.
* Self-contained frontend bundle without any CDN downloads.

# Try
[Demo](https://chat.nkonev.name/)

See [screenshots](./screenshots.md)

# Installation
* Use docker-swarm [files](./deploy)
* Replace `api.site.local` with your actual hostname, remove 8080 if need
* Replace 1.2.3.4 in ./deploy/video.yml with public ip if your deployment should be accessible from internet else comment it
* Configure "ingress" in deploy/traefik_conf/traefik.yml and docker-compose-infra.template.yml
* Open ports to traefik, described in deploy/docker-compose-infra.template.yml
* Open ports :3478, :5000 as described in deploy/docker-compose-video.template.yml
