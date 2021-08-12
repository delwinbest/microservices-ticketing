FROM node:alpine

WORKDIR /
COPY package*.json ./
RUN npm install -g npm@7.20.5
RUN npm install 

COPY . .

CMD ["npm", "run", "dev"]