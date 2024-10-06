FROM alpine:3.18
ARG PKG=github.com/kashalls/openterface-viewer
ARG VERSION=dev
ARG REVISION=dev

ENV NUXT_PUBLIC_VERSION=$VERSION
ENV NUXT_PUBLIC_REVISION=$REVISION
ENV NUXT_PUBLIC_SERVER=true

WORKDIR /app

RUN apk add --no-cache curl git bash
RUN curl -fsSL https://bun.sh/install | bash
ENV BUN_INSTALL="$HOME/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"
COPY package.json bun.lockb ./

RUN bun install
COPY . .
RUN bun run build

EXPOSE 3000
CMD ["bun", "run", "start"]
