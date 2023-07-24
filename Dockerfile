FROM node:18.17.0

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV PORT=300

EXPOSE $PORT  

CMD ["npm", "start"]