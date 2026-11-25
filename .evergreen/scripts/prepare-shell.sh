#!/bin/bash

PROJECT_DIRECTORY="$(pwd)"
PNPM_HOME="$HOME/.local/share/pnpm"

cat <<EOT > expansion.yml
PREPARE_SHELL: |
    PROJECT_DIRECTORY="$PROJECT_DIRECTORY"
    PNPM_HOME="$PNPM_HOME"

    export PATH=$PNPM_HOME/bin:$PNPM_HOME:$PROJECT_DIRECTORY/mongodb-tools:\$PATH
    export PROJECT_DIRECTORY
    export PNPM_HOME
EOT

cat expansion.yml
