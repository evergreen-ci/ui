import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  const [isPolling, setIsPolling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch(loginUrl, { credentials: "include" });
      if (response.ok) {
        setIsAuthenticated(true);
        // Clear interval when authenticated
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsPolling(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  }, [loginUrl]);

  const beginPollingAuth = useCallback(() => {
    // Clear any existing interval before starting a new one
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(checkAuth, 2000);
    setIsPolling(true);
  }, [checkAuth]);

  // Initial check for authentication
  useEffect(() => {
    const performInitialAuthCheck = async () => {
      await checkAuth();
    };
    performInitialAuthCheck();
  }, [checkAuth]);

  // Cleanup on unmount
  useEffect(
    () => () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    },
    [],
  );

  const memoizedContext = useMemo(
    () => ({
      beginPollingAuth,
      loginUrl,
      isPolling,
      isAuthenticated,
    }),
    [isPolling, isAuthenticated, beginPollingAuth, loginUrl],
  );

  return (
    <AuthContext.Provider value={memoizedContext}>
      {children}
    </AuthContext.Provider>
  );
};
