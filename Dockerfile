FROM node:14.5.0-alpine3.10

RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY package.json ./
COPY package-lock.json ./

ENV NPM_CONFIG_LOGLEVEL info

RUN npm install

RUN apk update

COPY . .

RUN npm run bootstrap

EXPOSE 8080
