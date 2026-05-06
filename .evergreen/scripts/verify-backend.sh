# Script that checks to see if the backend is running
# It will check to see if port 9090 is open
# If it is not, it will error

RED='\033[0;31m'
NC='\033[0m' # No Color
YELLOW='\033[1;33m'
# Check to see if evergreen is running on port 9090
if ! nc -z localhost 9090; then
    # If it is not, restart the backend
    echo "${RED}Evergreen is not running, please start it!${NC}"
    echo "Use the following command to start it:"
    echo "${YELLOW}make local-evergreen${NC}"
    exit 1
fi
