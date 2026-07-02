import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SageClient } from "api/sageClient";

type AuthState = {
  isAuthenticated: boolean;
  hasCheckedAuth: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthState>({
  isAuthenticated: false,
  hasCheckedAuth: false,
  logout: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

const SageClientContext = createContext<SageClient | null>(null);
export const useSageClient = () => {
  const client = useContext(SageClientContext);
  if (!client) {
    throw new Error("useSageClient must be used within a SageProvider");
  }
  return client;
};

export const SageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const client = useMemo(() => new SageClient(logout), [logout]);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await client.get("/login");
      setIsAuthenticated(result.ok);
      setHasCheckedAuth(true);
    };
    checkAuth();
  }, [client]);

  const authState = useMemo(
    () => ({ isAuthenticated, hasCheckedAuth, logout }),
    [isAuthenticated, hasCheckedAuth, logout],
  );

  return (
    <AuthContext.Provider value={authState}>
      <SageClientContext.Provider value={client}>
        {children}
      </SageClientContext.Provider>
    </AuthContext.Provider>
  );
};
