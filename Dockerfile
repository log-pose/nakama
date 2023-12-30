FROM oven/bun:latest as base

WORKDIR /app

COPY ./package.json .
COPY ./bun.lockb .

RUN bun install

COPY . .

CMD bun migrate:up && bun index.ts