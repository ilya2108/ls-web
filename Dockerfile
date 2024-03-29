FROM node:14-slim
WORKDIR /ls-web

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY ./ ./

ENV PORT 3000
EXPOSE 3000

CMD npm run dev
