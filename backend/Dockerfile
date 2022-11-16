FROM node:lts As development

ENV NODE_ENV=development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "run", "start:dev"]