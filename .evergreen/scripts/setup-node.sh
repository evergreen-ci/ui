#!/bin/bash
set -euo pipefail

# Source shell environment
eval "${PREPARE_SHELL}"

# Fetch NVM and install it into this task's .nvm directory
# Once downloaded, source nvm and install yarn
git clone https://github.com/nvm-sh/nvm.git "$NVM_DIR"
cd "$NVM_DIR"
git checkout `git describe --abbrev=0 --tags --match "v[0-9]*" $(git rev-list --tags --max-count=1)`
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
cd -

# Retry the download for Node in case it flakes.
for i in {1..5}; do
  nvm install --no-progress --default ${node_version}
  [[ $? -eq 0 ]] && break
  echo "Attempt $i of 5 to install Node failed"
  sleep 10
done
npm install -g yarn
npm install -g env-cmd
