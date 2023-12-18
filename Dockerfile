FROM oven/bun:debian as base

WORKDIR /app

COPY node_modules ./backend/nakama/node_modules
COPY bun.lockb ./backend/nakama/bun.lock
COPY package.json ./backend/nakama/package.json

RUN [ ! -d "node_modules" ] && bun install || echo "Using cached node_modules"


COPY ../lib /app/lib/
RUN cd backend/nakama 
COPY . /app/backend/nakama/

# CMD ["bun","/app/backend/nakama/index.ts"]