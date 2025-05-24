# STAGE ONE: Build app ========================================================
FROM node:22.14.0-alpine AS builder

# Recommended to install shared libraries that might be missing
# See: https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3?tab=readme-ov-file#nodealpine
RUN apk add --no-cache libc6-compat

# Enable Corepack and set Yarn version
RUN corepack enable && corepack prepare yarn@3.8.7 --activate

# Set working directory
WORKDIR /app

# Copy only package manager files for better caching
COPY yarn.lock package.json ./
COPY apps/web-ui/package.json apps/web-ui/package.json
COPY packages/rtk-query/package.json packages/rtk-query/package.json

# Ensure the proper options are used for building the app with yarn
COPY .yarnrc.yml ./

# Set platform specific npm flags and for sharp image optimizations install
RUN npm_config_platform=linux \
    npm_config_arch=x64 \
    npm_config_libc=musl

# Ensure proper endpoint set for static media during builds/apis
ARG NEXT_PUBLIC_SERVER_ENDPOINT
ARG OPENAPI_ENDPOINT
ENV NEXT_PUBLIC_SERVER_ENDPOINT=${NEXT_PUBLIC_SERVER_ENDPOINT}
ENV OPENAPI_ENDPOINT=${OPENAPI_ENDPOINT}

RUN echo OPEN_API_ENDPOINT && \
    echo NEXT_PUBLIC_SERVER_ENDPOINT


# Install dependencies (including workspaces)
RUN yarn install --immutable
# TODO: fix `yarn add sharp` in docker image failing

# Copy the full repo (for build)
COPY apps/web-ui/ apps/web-ui/
COPY packages/rtk-query/ packages/rtk-query/

# Run the api codegen
ENV OPENAPI_ENDPOINT="./src/openapi.json"
RUN yarn workspace @open-whisperer/rtk-query codegen

# Build the Next.js app (standalone output set in next.config.js)
ENV NEXT_TELEMETRY_DISABLED=1
RUN yarn workspace @open-whisperer/web-ui build:no-lint

# For debug (i.e.: DOCKER_BUILDKIT=0 docker-compose up --build)
RUN echo "==== FIRST BUILD PROCESS ====" \
  && echo "==== /app contents ====" && ls -al /app \
  && echo "==== /app/apps/web-ui contents ====" && ls -al /app/apps/web-ui \
  && echo "==== /app/apps/web-ui/.next contents ===" && ls -al /app/apps/web-ui/.next


# FINAL STAGE: Lightweight Production image ===================================
# Only includes standalone files (@read https://nextjs.org/docs/app/api-reference/config/next-config-js/output)
FROM node:22.14.0-alpine AS runner

WORKDIR /app

# Add non-root user
RUN addgroup --system nodejs
RUN adduser --system nextjs

# Copy standalone app and server file from build stage
COPY --from=builder --chown=nextjs:nodejs /app/apps/web-ui/.next/standalone/ ./

# Copy static and public projects files
COPY --from=builder --chown=nextjs:nodejs /app/apps/web-ui/public/ apps/web-ui/public/
COPY --from=builder --chown=nextjs:nodejs /app/apps/web-ui/.next/static/ apps/web-ui/.next/static/

# For debug (i.e.: DOCKER_BUILDKIT=0 docker-compose up --build)
RUN echo "==== /app contents ====" && ls -al /app \
  && echo "==== /app/apps/web-ui contents ====" && ls -al /app/apps/web-ui \
  && echo "==== /app/apps/web-ui/.next contents ====" && ls -al /app/apps/web-ui/.next

USER nextjs

# Expose port and run the app
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# working_dir -> /app/apps/web-ui (docker-compose)
# WORKDIR is for builds only, while "working_dir" in docker-compose is for when container is running
CMD ["node", "server.js"]
