FROM node

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /usr/src/app

# Installing dependencies
COPY package.json ./
RUN yarn

# Copying source files
COPY . .

# Building app
RUN yarn build

# for local development or CI
# COPY key.json key.json
# ENV GOOGLE_APPLICATION_CREDENTIALS key.json

# Running the app
CMD yarn start --port $PORT
