FROM node:lts As development

ENV NODE_ENV=development

WORKDIR /app

COPY package*.json ./

RUN npm install -g @nestjs/cli

RUN npm install

COPY . .



# EXPOSE 5000

CMD [ "node", "dist/main.js"]