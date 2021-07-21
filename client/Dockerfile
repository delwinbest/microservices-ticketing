FROM node:alpine

WORKDIR /
COPY package*.json ./
RUN npm install -g npm@7.20.0
RUN npm install 

COPY . .

CMD ["npm", "run", "dev"]