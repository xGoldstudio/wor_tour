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
RUN turbo prune data_server --docker

# Add lockfile and package.json's of isolated subworkspaces
FROM base AS installer
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN pnpm install
CMD ["ls", "/app/apps/"]

# Build the project
COPY --from=builder /app/out/full/ .
RUN pnpm add -g rollup@^2.56
RUN pnpm turbo run build --filter=data_server

FROM base AS runner
WORKDIR /app

# We need the data folder to be able to serve the game informations and images
COPY --from=installer /app/apps/DataServer/data /app/data
COPY --from=installer /app/apps/DataServer/dist /app/dist
# Don't run production as root
# Give the node user access to read files
RUN chown -R node /app
USER node

CMD [ "node", "/app/dist/bundle.cjs" ]