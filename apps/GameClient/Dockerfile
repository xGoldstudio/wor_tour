FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
# Set working directory
WORKDIR /app
RUN pnpm add -g turbo@^1.12
COPY . .

RUN cat package.json
RUN turbo prune game_client --docker

# Add lockfile and package.json's of isolated subworkspaces
FROM base AS installer
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN pnpm install

# Build the project
COPY --from=builder /app/out/full/ .
RUN pnpm add -g typescript
RUN pnpm turbo run build --filter=game_client

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN pnpm add -g serve
USER node
COPY --from=installer /app/apps/GameClient/dist /app/dist

CMD [ "serve", "-s", "dist", "-p", "4000" ]