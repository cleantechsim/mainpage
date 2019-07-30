FROM node:10 AS build-env

WORKDIR /compile

COPY package*.json ./
COPY tsconfig.json .

RUN npm install

COPY . .

RUN npm run tsc 

FROM node:10
WORKDIR /app
COPY --from=build-env /compile/node_modules node_modules
COPY --from=build-env /compile/build .
COPY --from=build-env /compile/app/views views
COPY --from=build-env /compile/app/public public

EXPOSE 3000

CMD [ "node", "app.js" ]

