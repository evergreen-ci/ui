import { initializeErrorHandling } from "components/ErrorHandling";
import { useAuthStateContext } from "context/Auth";

const useInitializeErrorHandling = () => {
  const { isAuthenticated } = useAuthStateContext();
  if (isAuthenticated) {
    initializeErrorHandling();
  }
};
export { useInitializeErrorHandling };
