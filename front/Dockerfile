FROM node:14

# Create app directory
WORKDIR /usr/app

EXPOSE 3000

COPY . /usr/app

RUN npm install -g npm@latest && npm install 
        # && npm cache clean --force \
        # && npm rm -rf node_modules && rm package-lock.json


# RUN npm install

# # Building app
# RUN npm run build

# # Running the app
CMD "npm" "run" "dev"