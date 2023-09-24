yarn global add @nestjs/cli
nest new nestlearn
->yarn

git remote add origin git@github.com:shinichiok2614/nestjsNDH.git
git status
git add .
git push origin main

cd nestlearn
yarn run start
yarn run start:dev

nest g module user //gen 1 module moi va auto-import

ls -la

<!-- chỉ hiện cont đang chạy -->

docker ps
docker ps -a
docker

<!-- -d: detach- chạy ở chế độ nền, -p: port {port in host}:{port in Container} -->

docker run -d -p 80:80 docker/getting-started

<!-- {official name corp}:{tag} -->

docker pull mcr.microsoft.com/mssql/server:2019-latest

<!-- Image is up to date for ... -->

docker images

<!-- remove image id -->

docker rmi 3e4394f6b72f
docker ps

<!-- remove container -f:force-xoa khi dang run, k can stop -->

docker rm --force 818548bbb0aa
docker rmi 3e4394f6b72f

<!-- luu data trong container thi dung volumn: anh xa du lieu -->
<!-- 1 image -> N containers -->
<!-- giao tiep voi container: run -->
<!-- -e: environment-tai khoan SA-system admintrator; -d: detach-chay ngam; \: xuong dong-->

docker run \
-e "ACCEPT_EULA=Y" \
-e "MSSQL_SA_PASSWORD=Abc@123456789" \
--name sql-server-2019-container \
-p 1435:1433 \
-d mcr.microsoft.com/mssql/server:2019-latest

<!-- =>2a4e9ebaa1b5f824a7617ec50011ae42c76f067bc70e4e0440d3a1680909be40: container's ID-moi lan chay moi khac -->

docker logs 2a4e9ebaa1b5
docker stop 23f3d55c256d
docker start sql-server-2019-container

<!-- xem dia chi thu muc hien tai -->

pwd

<!-- -v:volumn - map - anh xa thu muc tren {host}:{container} * duong dan tuyet doi (win: thay \ bang ^)-->

docker run \
-e "ACCEPT_EULA=Y" \
-e "MSSQL_SA_PASSWORD=Abc@123456789" \
--name sql-server-2019-container \
-p 1435:1433 \
-v /Users/pc/Desktop/repo/nestlearn/data:/var/opt/mssql \
-d mcr.microsoft.com/mssql/server:2019-latest

<!-- khong nhin thay duong dan tuyet doi -->

docker volume ls

<!-- -v {duong dan tuong doi}:{container} luu tren server docker -->

docker run \
-e "ACCEPT_EULA=Y" \
-e "MSSQL_SA_PASSWORD=Abc@123456789" \
--name sql-server-2019-container \
-p 1435:1433 \
-v my-volume-1:/var/opt/mssql \
-d mcr.microsoft.com/mssql/server:2019-latest

docker volume ls

<!-- xem noi luu volume tren server docker -->

docker volume inspect my-volume-1

<!-- duong dan volume tren host -->

ls -la ~/library/containers/com.docker.docker/data/vms/0

CREATE DATABASE TestDB;
use TestDB;
create table tblStudent(
studentId int IDENTITY(1,1),
studentName NVARCHAR(100),
age int CHECK(age>0)
)
select \* from tblStudent;
INSERT into tblStudent(studentName, age)
VALUEs('tuan',20)

docker run \
--name mysql8-container \
-e MYSQL_ROOT_PASSWORD=Abc@123456789 \
-p 3308:3306 \
-v mysql8-volume:/var/lib/mysql \
-d mysql:8.1.0

<!-- -it:iteractive mode -->

docker exec -it mysql8-container bash
bash# mysql -u root -p
mysql> show databases;
mysql>
create database TestDB;
use TestDB;
create table studentTB(
id int primary key auto_increment,
name nvarchar(100),
age int check(age>0)
);
insert into studentTB(name, age)
values ('tuan', 20);
show databases;
select \* from studentTB;
mysql>exit
bash# exit
docker volume ls

<!-- windows: \\wsl$\docker-desktop-data\version-pack-data\community\docker\volumes -->

<!-- nhieu container cung 1 network va ket noi voi nhau -->

docker network create todo-app-network

<!-- ls: list -->

docker network ls

docker run -d \
--name mysql-container \
--network todo-app-network \
--network-alias todo-app-network-alias \
-v todo-mysql-database:/var/lib/mysql \
-e MYSQL_ROOT_PASSWORD=Abc@123456789 \
-e MYSQL_DATABASE=todoDB \
-d mysql

docker exec -it mysql-container mysql -u root -p
mysql> show databases;

<!-- ->co san todoDB -->

use todoDB;
show tables;
exit

<!-- tao container netshoot cung network voi todo-app-network, vao thang che do it -->

docker run -it \
--network todo-app-network \
--name netshoot-container \
nicolaka/netshoot
adfsdf? ls -la
pwd
ls -la /

<!-- dig: DNS lookup utility -->

dig todo-app-network-alias

<!-- exit thi dig lai bi tat, phai su dung -d -->

exit

<!-- -rm: neu k chay dc thi xoa luon-dung cho test -->

docker run -dp 3002:3000 \
--name todo-app-container \
-w /app -v "$(pwd):/app" \
--network todo-app-network \
-e MYSQL_HOST=todo-app-network-alias \
-e MYSQL_USER=root \
-e MYSQL_PASSWORD=Abc@123456789 \
-e MYSQL_DB=todoDB \
node \
sh -c "yarn install && yarn run:dev"

ls -la
npm init -y
yarn add ronin-server ronin-mocks

<!-- server.js -->

const ronin = require("ronin-server");
const mocks = require("ronin-mocks");
const server = ronin.server();

server.use("/", mocks.server(server.Router(), false, true));
const PORT = 8000;
console.log("server is listenng on", PORT);
server.start();
//8000
/_
curl --request POST \
--url http://localhost:8000/test \
--header 'content-type:application/json' \
--data '{"name":"tuan","content":"How are you"}'
_/

<!--  -->

node server.js

<!--   "main": "server.js", -->

nodemon --watch server.js

<!-- "run:dev":"nodemon --watch server.js", -->

yarn run:dev

<!-- "run:dev":"yarn install && nodemon --watch server.js", -->

yarn run:dev

<!-- custom image: Dockerfile -->
<!-- # syntax=docker/dockerfile:1   docker cu van doc duoc -->
<!-- nhieu lenh run, chi co 1 lenh cmd -->
<!-- dockerfile -->

# syntax=docker/dockerfile:1

FROM node:latest
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json","package-lock.json*","./"]
COPY . .
RUN yarn install
RUN npm install -g nodemon
CMD [ "yarn","run:dev" ]

<!-- .dockerignore -->

node_modules

<!-- . : thu muc hien tai chua dockerfile -->

docker build --tag node-mysql-image .
docker tag node-mysql-image:latest node-mysql-image:v1.0.0
docker tag node-mysql-image:v1.0.0 shinichiok2614/node-mysql-image:v1.0.0
docker rmi node-mysql-image:latest

<!-- docker hub -->
<!-- create repository: node-mysql-image -->

docker login

<!-- phuonghoangit2614@gmail.com -->

docker push shinichiok2614/node-mysql-image:v1.0.0

docker images
docker rmi shinichiok2614/node-mysql-image:v1.0.0
docker pull shinichiok2614/node-mysql-image:v1.0.0

<!-- already exists -->
<!-- (git clone truoc) copy 3 file qua thu muc can run truoc, run thi yarn se install sau, nen se cai duoc thu vien va scripts -->
<!-- thu tu: truy xuat file xong thu muc xong->run (chu k phai run images xong moi truy cap file) -->
<!-- copy package.json package.lock.json server.js -->

docker run -dp 8002:8000 \
--name node-mysql-container \
-w /app -v "$(pwd):/app" \
--network todo-app-network \
-e MYSQL_HOST=todo-app-network-alias \
-e MYSQL_USER=root \
-e MYSQL_PASSWORD=Abc@123456789 \
-e MYSQL_DB=todoDB \
shinichiok2614/node-mysql-image:v1.0.0 \
sh -c "yarn install && yarn run:dev"

docker logs node-mysql-container

curl http://localhost:8002/test

docker exec -it node-mysql-container bash

<!-- Docker Compose -->

docker-compose version

<!-- node-mysql-docker-composer.yml -->
<!-- - co dau :, k co dau - chi co gia tri -->

version: '3.7'
services:
node-mysql-container:
image: shinichiok2614/node-mysql-image:v1.0.0
container_name: node-mysql-container
command: sh -c "yarn install && yarn run:dev"
ports: - 8002:8000
working_dir: /app
volumes: - ./:/app
networks: - backend
environment:
MYSQL_HOST: todo-app-network-alias
MYSQL_USER: root
MYSQL_PASSWORD: Abc@123456789
MYSQL_DB: todoDB
mysql-container:
image: mysql
container_name: mysql-container
ports: - 3308:3306
volumes: - todo-mysql-database:/var/lib/mysql
networks: - backend
environment:
MYSQL_ROOT_PASSWORD: Abc@123456789
MYSQL_DATABASE: todoDB
networks:
backend:
name: todo-app-network
volumes:
todo-mysql-database:

docker rm -f netshoot-container
docker rm -f todo-app-container
docker rm -f gracious_haibt
docker rm -f sql-server-2019-container

docker rm -f node-mysql-container
docker rm -f mysql-container
docker network rm todo-app-network

<!-- -f: file; -d: detach -->

docker-compose -f ./node-mysql-docker-composer.yml up -d

<!-- Deploy kubernetes cluster -->

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->
