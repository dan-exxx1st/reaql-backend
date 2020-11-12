FROM node:14.15.0-alpine3.10

RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

EXPOSE 8080

CMD [ "yarn", "dev" ]