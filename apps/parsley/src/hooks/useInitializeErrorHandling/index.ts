import { initializeErrorHandling } from "components/ErrorHandling";
import { useAuthContext } from "context/auth";

const useInitializeErrorHandling = () => {
  const { isAuthenticated } = useAuthContext();
  if (isAuthenticated) {
    initializeErrorHandling();
  }
};
export { useInitializeErrorHandling };
