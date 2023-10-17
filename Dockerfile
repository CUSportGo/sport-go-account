FROM node

WORKDIR /app

COPY package.json .

RUN yarn  

COPY . .

RUN npx prisma generate

EXPOSE 8081 8082

CMD ["yarn", "start:dev"]

