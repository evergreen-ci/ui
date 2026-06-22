# This script waits for Evergreen to be up and running.

RED='\033[0;31m'
NC='\033[0m' # No Color

# Fail the task instead of waiting indefinitely if Evergreen never comes up.
TIMEOUT_SECONDS=300

# Listen on port 9090 for Evergreen.
echo "Waiting for Evergreen to be up and running..."
elapsed=0
while ! nc -z localhost 9090; do
    if [ "$elapsed" -ge "$TIMEOUT_SECONDS" ]; then
        echo "${RED}Evergreen did not come up within ${TIMEOUT_SECONDS} seconds, exiting.${NC}"
        exit 1
    fi
    sleep 1
    elapsed=$((elapsed + 1))
done

echo "Evergreen is up and running!"
