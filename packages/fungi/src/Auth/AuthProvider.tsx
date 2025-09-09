import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AuthContextState = {
  beginPollingAuth: () => void;
  isAuthenticated: boolean;
  isPolling: boolean;
  loginUrl: string;
};

export const AuthContext = createContext<AuthContextState>({
  beginPollingAuth: () => {},
  isAuthenticated: false,
  isPolling: false,
  loginUrl: "",
});

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider",
    );
  }
  return context;
};

export type AuthProviderProps = {
  loginUrl: string;
};

export const AuthProvider = ({
  children,
  loginUrl,
}: React.PropsWithChildren<AuthProviderProps>) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch(loginUrl, { credentials: "include" });
      if (response.ok) {
        setIsAuthenticated(true);
        // Clear interval when authenticated
        if (intervalId) {
          clearInterval(intervalId);
          setIntervalId(null);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  }, [loginUrl, intervalId]);

  const beginPollingAuth = useCallback(() => {
    // Clear any existing interval before starting a new one
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    const newIntervalId = setInterval(checkAuth, 2000);
    setIntervalId(newIntervalId);
  }, [checkAuth, intervalId]);

  // Initial check for authentication
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Cleanup on unmount
  useEffect(
    () => () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    },
    [intervalId],
  );

  const memoizedContext = useMemo(
    () => ({
      beginPollingAuth,
      loginUrl,
      isPolling: intervalId !== null,
      isAuthenticated,
    }),
    [intervalId, isAuthenticated, beginPollingAuth, loginUrl],
  );

  return (
    <AuthContext.Provider value={memoizedContext}>
      {children}
    </AuthContext.Provider>
  );
};
