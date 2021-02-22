FROM node:15

COPY . /code

WORKDIR /code

RUN yarn