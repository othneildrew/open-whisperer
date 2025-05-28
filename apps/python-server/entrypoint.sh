#!/bin/bash

# Load .env variables
set -o allexport
source /app/.env
set +o allexport

# Print all environment variables for debugging
echo "Environment variables:"
printenv

# Start cron in the background if IS_DEMO is "1" or 1
if [ "$IS_DEMO" = "1" ] || [ "$IS_DEMO" = 1 ]; then
  echo "Will run cron job!"
  cron
fi


# Start your Python app in the foreground
exec python run.py
