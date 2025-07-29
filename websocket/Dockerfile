FROM node:22-alpine

WORKDIR /websocket
COPY package*.json ./
RUN npm install --production

COPY . .

ENV PORT=5000
ENV FRONTEND_URL=http://localhost:3000

EXPOSE 5000

CMD ["npm", "run", "dev"]
