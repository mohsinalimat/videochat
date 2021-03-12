[![Build Status](https://github.com/nkonev/videochat/workflows/CI%20jobs/badge.svg)](https://github.com/nkonev/videochat/actions)


# Architecture:

![Architecture](./.markdown/auth.png "Title")


## Start docker-compose
```bash
docker-compose up -d
```

## Build static
Before development, you need to build static (html, sql). Please see `.travis.yml`

# Test in browser
Open `http://localhost:8081/chat` in Firefox main and an Anonymous window;
Login as `admin:admin` in main window and as `nikita:password` in the Anonymous window.
Create chat in main window and add `nikita` there.


## Generating password
```bash
sudo yum install -y httpd-tools

# generate password
htpasswd -bnBC 10 "" password | tr -d ':'
```