FROM oven/bun:debian as base

WORKDIR /app

COPY ./package.json .
COPY ./bun.lockb .

RUN bun install

COPY . .

CMD ["bun", "index.ts"]