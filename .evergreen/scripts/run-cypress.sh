#!/bin/bash
set -euo pipefail

# Source shell environment
eval "${PREPARE_SHELL}"

# Allow spec filtering for an intentional patch.
if [[ "${cypress_spec}" != "" ]]; then
  CYPRESS_CI=true CYPRESS_SKIP_VERIFY=true yarn cy:run --reporter junit --spec "${cypress_spec}"
else
  CYPRESS_CI=true CYPRESS_SKIP_VERIFY=true yarn cy:run --reporter junit
fi
