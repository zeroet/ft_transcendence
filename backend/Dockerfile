FROM node:lts As development

WORKDIR /app

COPY package*.json ./

RUN npm install -g @nestjs/cli

RUN npm install

COPY . .



EXPOSE 3000

CMD [ "node", "dist/main.js"]