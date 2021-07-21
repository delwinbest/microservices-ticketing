FROM node:alpine

WORKDIR /app
COPY package*.json ./
RUN npm install -g npm@7.20.0
RUN npm install --only=prod

COPY . .

CMD ["npm", "start"]