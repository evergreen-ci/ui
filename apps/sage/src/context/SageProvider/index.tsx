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

type AuthState = {
  error: ApiError | null;
  hasCheckedAuth: boolean;
  isAuthenticated: boolean;
};

type SageContextState = {
  auth: AuthState;
  client: SageClient;
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
  const [auth, setAuth] = useState<AuthState>({
    error: null,
    hasCheckedAuth: false,
    isAuthenticated: false,
  });

  // Clears local auth state only.
  // Improvement: call /logout endpoint to clear server session, but that doesn't exist right now
  const logout = useCallback(() => {
    setAuth((prev) => ({ ...prev, isAuthenticated: false }));
  }, []);

  const client = useMemo(() => new SageClient(sageAPIURL, logout), [logout]);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await client.get("/login");
      if (result.ok) {
        setAuth({ error: null, hasCheckedAuth: true, isAuthenticated: true });
      } else {
        setAuth({
          error: result,
          hasCheckedAuth: true,
          isAuthenticated: false,
        });
      }
    };
    checkAuth();
  }, [client]);

  const value = useMemo(
    () => ({ auth, client, logout }),
    [auth, client, logout],
  );

  return <SageContext.Provider value={value}>{children}</SageContext.Provider>;
};
