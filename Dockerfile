FROM node:16.14.2

WORKDIR /workDir

COPY package.json /workDir/package.json

COPY . /workDir/

RUN npm ci
RUN npm run build

COPY /src/public /workDir/dist/public

ARG ENV="production"
ENV PORT 4500
ENV NODE_ENV=${ENV}

EXPOSE 4500

CMD [ "node", "./dist/bin/www" ]
