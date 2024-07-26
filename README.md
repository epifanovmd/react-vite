# React VITE

React Typescript Mobx Application

##### Stack:
  - Typescript
  - React
  - Styled Components
  - Vite

### Installation
```sh
$ git clone https://github.com/epifanovmd/react-vite.git
$ cd react-vite
$ yarn
```

### Run
```sh
$ yarn prod
```
```sh
Application listening on: http://localhost:3000
```

### Start app in docker container
```sh
$ docker build -f Dockerfile -t react-vite:latest .
$ [[ $(docker ps -f name=react-vite_container -q -a) != '' ]] && docker rm --force $(docker ps -f name=react-vite_container -q -a)
$ docker run -u root -d --restart=always --network server-net -p 8080:4173 --name react-vite_container react-vite:latest
$ docker image prune -a --force
```

```sh
Application listening on: http://localhost:8080
```

License
----

MIT

**Free Software, Good Work!**
