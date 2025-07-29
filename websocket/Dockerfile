FROM node:22-alpine

WORKDIR /websocket
COPY package*.json ./
RUN npm install --production

COPY . .

CMD ["npm", "run", "dev"]
