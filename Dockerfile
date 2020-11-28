FROM node:15.3.0-alpine3.10

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

CMD [ "npm","run", "dev" ]