#!/bin/bash

DUMP_ROOT=${TMPDIR}evg_dump

EVERGREEN_DB_NAME="evergreen_local"
EVERGREEN_URI="mongodb://localhost:27017/$EVERGREEN_DB_NAME"
EVERGREEN_DUMP_FOLDER="$DUMP_ROOT/$EVERGREEN_DB_NAME"

AMBOY_DB_NAME="amboy_local"
AMBOY_URI="mongodb://localhost:27017/$AMBOY_DB_NAME"
AMBOY_DUMP_FOLDER="$DUMP_ROOT/$AMBOY_DB_NAME"

RUNTIME_ENVIRONMENTS_SCRIPT_PATH="$(dirname "${BASH_SOURCE[0]}")/add-runtime-environments-creds.js"

# Function to clean up temporary dump files.
clean_up() {
    rm -rf "$DUMP_ROOT"
    echo "Cleaned up $DUMP_ROOT."
}

# Function to reseed databases with smoke test data.
reseed_databases() {
    # Change the current directory sdlschema symlink.
    if ! cd -- "$(dirname -- "$(readlink -- "sdlschema")")"; then
        echo "Unable to find Evergreen directory from the sdlschema symlink"
        exit 1
    fi

    # Load test data into the database.
    ../bin/load-smoke-data -path ../testdata/local -dbName "$EVERGREEN_DB_NAME" -amboyDBName "$AMBOY_DB_NAME"

    cd -

    # Load credentials for the Image Visibility API.
    echo "Adding runtime environments credentials..."
    if [ "$CI" != 'true' ]; then
        mongosh $EVERGREEN_DB_NAME --quiet $RUNTIME_ENVIRONMENTS_SCRIPT_PATH
    else
        ../../evergreen/mongosh/mongosh $EVERGREEN_DB_NAME --quiet $RUNTIME_ENVIRONMENTS_SCRIPT_PATH
    fi
    echo "Finished adding runtime environments credentials."

    cd - || exit
}

# Helper function for dumping DBs.
# Pass the DB name as the first argument and the URI as the second argument.
dump_db() {
    # Use 'mongodump' to create a database dump.
    if ! mongodump --quiet --uri="$2" -o "$DUMP_ROOT"; then
        echo "Error creating dump from $1 db."
        exit 1
    fi
    echo "$1 dump successfully created in $DUMP_ROOT"
}

# Function to create dumps of the databases.
dump_databases() {
    clean_up
    dump_db "$AMBOY_DB_NAME" "$AMBOY_URI"
    dump_db "$EVERGREEN_DB_NAME" "$EVERGREEN_URI"
}

# Function to reseed the databases and then create dumps.
reseed_and_dump_databases() {
    reseed_databases
    dump_databases
}

# Function to restore database from a dump.
# Pass the dump folder as the first argument and the URI as the second argument.
restore_db() {
    MAX_RETRIES=2

    # Check if the specified dump folder exists.
    if [ ! -d "$1" ]; then
        echo "Error: $1 does not exist. Ensure you have a valid dump before restoring."
        exit 1
    fi

    # Use 'mongorestore' to restore the database from the dump.
    for ((retry=0; retry<=MAX_RETRIES; retry++)); do
        if mongorestore --quiet --drop --uri="$2" "$1"; then
            echo "Successfully restored the database from $1."
            break
        else
            echo "Error restoring the database from $1. Retry attempt: $retry"
            if [ $retry -eq $MAX_RETRIES ]; then
                echo "Max retries reached. Exiting."
                exit 1
            fi
            sleep 3
        fi
    done
}

# Check the command-line argument to determine the action to perform.
case "$1" in
    --dump)
        dump_databases
        ;;
    --restore)
        if [ "$2" = "evergreen" ]; then
            restore_db "$EVERGREEN_DUMP_FOLDER" "$EVERGREEN_URI"
        fi
        if [ "$2" = "amboy" ]; then
            restore_db "$AMBOY_DUMP_FOLDER" "$AMBOY_URI"
        fi
        ;;
    --clean-up)
        clean_up
        ;;
    --reseed)
        reseed_databases
        ;;
    --reseed-and-dump)
        reseed_and_dump_databases
        ;;
    *)
        echo "Usage: $0 {--dump|--restore <evergreen|amboy>|--clean-up|--reseed-and-dump}"
        exit 1
        ;;
esac
