#!/bin/bash

PROJECT_DIRECTORY="$(pwd)"
NODE_HOME="$PROJECT_DIRECTORY/.node"

export PROJECT_DIRECTORY
export NODE_HOME

cat <<EOT > expansion.yml
PREPARE_SHELL: |
    PROJECT_DIRECTORY="$PROJECT_DIRECTORY"
    NODE_HOME="$NODE_HOME"

    export PATH=$NODE_HOME/bin:$PROJECT_DIRECTORY/mongodb-tools:\$PATH
    export PROJECT_DIRECTORY
    export NODE_HOME
EOT

cat expansion.yml
