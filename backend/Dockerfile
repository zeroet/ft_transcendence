FROM node:lts

WORKDIR /app

COPY package*.json ./

# RUN npm ci
COPY . .

RUN npm install


EXPOSE 3000

CMD [ "node", "dist/main.js"]