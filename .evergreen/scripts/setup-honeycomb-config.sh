#!/bin/bash
set -euo pipefail

if [ "${target}" = "staging" ]; then
  echo "REACT_APP_HONEYCOMB_ENDPOINT: ${HONEYCOMB_ENDPOINT_STAGING}" >> honeycomb.yml
  echo "REACT_APP_HONEYCOMB_INGEST_KEY: ${HONEYCOMB_INGEST_KEY_STAGING}" >> honeycomb.yml
  # If target is production or beta, set the honeycomb endpoint and ingest key to production
elif [ "${target}" = "production" ] || [ "${target}" = "beta" ]; then
  echo "REACT_APP_HONEYCOMB_ENDPOINT: ${HONEYCOMB_ENDPOINT_PROD}" >> honeycomb.yml
  echo "REACT_APP_HONEYCOMB_INGEST_KEY: ${HONEYCOMB_INGEST_KEY_PROD}" >> honeycomb.yml
fi
