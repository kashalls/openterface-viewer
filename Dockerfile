FROM oven/bun:1 AS base
ARG PKG=github.com/kashalls/openterface-viewer
ARG VERSION=dev
ARG REVISION=dev

ENV NUXT_PUBLIC_VERSION=$VERSION
ENV NUXT_PUBLIC_REVISION=$REVISION
ENV NUXT_PUBLIC_SERVER=true

WORKDIR /app

COPY . .
RUN bun install
RUN bun run build

USER bun
EXPOSE 3000/tcp
CMD ["bun", "run", "start"]
