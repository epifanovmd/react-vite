ARG NODE_VERSION=20.10.0

FROM node:${NODE_VERSION}

WORKDIR .
COPY . ./react-vite

WORKDIR ./react-vite

RUN yarn
RUN yarn build

EXPOSE 4173
CMD ["yarn", "run", "prod"]
