# Dockerfile for python-server: clean, production-ready multi-stage build

# STAGE ONE: Build deps =======================================================
FROM python:3.11-slim AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    build-essential \
    python3-dev \
    libffi-dev \
    ffmpeg \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Just copy requirements to leverage caching
COPY apps/python-server/requirements.txt/ .

# Upgrade pip inside virtual env, then install to /install
RUN pip install --upgrade pip \
    && pip install --target=/install -r requirements.txt

# Now copy full source code
COPY apps/python-server/ .

# FINAL STAGE: Runtime ========================================================
FROM python:3.11-slim AS runtime

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    cron \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Add non-root user
RUN addgroup --system py
RUN adduser --system fastapi

# Copy app and installed Python packages
COPY --from=builder --chown=fastapi:py /app /app
COPY --from=builder --chown=fastapi:py /install /usr/local/lib/python3.11/site-packages

# Copy & setup cron job from removing sessions
COPY --from=builder /app/app/cron/purge_sessions_cron /etc/cron.d/purge_sessions_cron
RUN chmod 0644 /etc/cron.d/purge_sessions_cron
RUN crontab /etc/cron.d/purge_sessions_cron
RUN touch /var/log/cron.log

RUN chmod +x /app/entrypoint.sh

# Set environment
ENV ENV=production
ENV PORT=8000
ENV HOST="0.0.0.0"

# Start server
# CMD ["python", "run.py"]
ENTRYPOINT ["/app/entrypoint.sh"]