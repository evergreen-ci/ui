#!/bin/bash
set -euo pipefail

# Add PROFILER to env if profiler patch parameter is set to true.
if [ "${profiler}" = "true" ]; then
    echo "PROFILER is set to true, adding profiler to the build"
    PROFILER=true PROFILE_HEAD="<script src=\"https://localhost:8097\"></script>" yarn env-cmd --no-override -e "${target}" yarn deploy-utils-build-and-push
else
    yarn env-cmd --no-override -e "${target}" yarn deploy-utils-build-and-push
fi
