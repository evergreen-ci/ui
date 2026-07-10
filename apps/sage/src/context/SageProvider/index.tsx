import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ApiError, SageClient } from "api/sageClient";
import { sageAPIURL } from "utils/environmentVariables";

type SageContextState = {
  authError: ApiError | null;
  client: SageClient;
  hasCheckedAuth: boolean;
  isAuthenticated: boolean;
  logout: () => void;
};

const SageContext = createContext<SageContextState | null>(null);

export const useSageContext = () => {
  const ctx = useContext(SageContext);
  if (!ctx) {
    throw new Error("useSageContext must be used within a SageProvider");
  }
  return ctx;
};

export const SageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [authError, setAuthError] = useState<ApiError | null>(null);

  // Clears local auth state only.
  // Improvement: call /logout endpoint to clear server session, but that doesn't exist right now
  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const client = useMemo(() => new SageClient(sageAPIURL, logout), [logout]);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await client.get("/login");
      if (result.ok) {
        setIsAuthenticated(true);
        setAuthError(null);
      } else {
        setIsAuthenticated(false);
        setAuthError(result);
      }
      setHasCheckedAuth(true);
    };
    checkAuth();
  }, [client]);

  const value = useMemo(
    () => ({ client, isAuthenticated, hasCheckedAuth, authError, logout }),
    [client, isAuthenticated, hasCheckedAuth, authError, logout],
  );

  return <SageContext.Provider value={value}>{children}</SageContext.Provider>;
};
