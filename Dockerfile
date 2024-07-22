FROM alpine:3.18 as builder
ARG PKG=github.com/kashalls/openterface-viwer
ARG VERSION=dev
ARG REVISION=dev

ENV VERSION=$VERSION
ENV REVISION=$REVISION

WORKDIR /app

RUN apk add --no-cache curl git bash
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"
COPY package.json bun.lockb ./

RUN bun install
COPY . .
RUN bun run build

EXPOSE 3000
CMD ["bun", "run", "start"]
