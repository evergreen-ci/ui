import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithRetry, getUserStagingHeader } from "../../utils/request";

type AuthProviderDispatchMethods = {
  /**
   * localLogin - used only if `shouldUseLocalAuth` is true.
   * @param credentials - credentials to login with
   * @param credentials.username - username
   * @param credentials.password - password
   */
  localLogin: (credentials: { username: string; password: string }) => void;
  /**
   * logoutAndRedirect - calls the logout endpoint for localAuth
   * or redirects to the remoteAuthURL for remoteAuth.
   */
  logoutAndRedirect: () => void;
  /**
   * A helper to mark the user as authenticated in local state
   * (useful if you get a successful check from somewhere else).
   */
  dispatchAuthenticated: () => void;
};

type AuthState = {
  /**
   * `isAuthenticated` is a boolean that determines whether the user is currently authenticated.
   */
  isAuthenticated: boolean;
};

const AuthStateContext = createContext<
  (AuthState & AuthProviderDispatchMethods) | null
>(null);

/**
 * `AuthProvider` is a context provider that manages the authentication state of the application.
 * It provides support for both local and remote authentication strategies.
 * `localAuthentication` is used for local development when connected to a local development environment and `remoteAuthentication` is used for production or when connected to a remote development environment.
 * @param props -
 * @param props.children - The children of the `AuthProvider` component.
 * @param props.localAuthRoute - The route of the local authentication provider UI. (Only used in local development)
 * @param props.remoteAuthURL - The URL of the remote authentication provider.
 * @param props.shouldUseLocalAuth - A boolean that determines whether to use local or remote authentication.
 * @param props.evergreenAppURL - The URL of the backend service we will authenticate against.
 * @returns - The `AuthProvider` component.
 */
const AuthProvider: React.FC<{
  children: React.ReactNode;
  /** `evergreenAppURL` is the URL of the backend service we will authenticate against */
  evergreenAppURL: string;
  /** `remoteAuthURL` is the URL that we should redirect the user to if they are not currently authenticated when `shouldUseLocalAuth` is false */
  remoteAuthURL: string;
  /** `localAuthRoute` is the route that we should redirect the user to if they are not currently authenticated when `shouldUseLocalAuth` is true */
  localAuthRoute: string;
  /** `shouldUseLocalAuth` determines which authentication strategy we should use. */
  shouldUseLocalAuth: boolean;
}> = ({
  children,
  evergreenAppURL,
  localAuthRoute,
  remoteAuthURL,
  shouldUseLocalAuth,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const authMethods: AuthProviderDispatchMethods = useMemo(
    () => ({
      /**
       * localLogin - used only if `shouldUseLocalAuth` is true.
       * @param credentials - credentials to login with
       * @param credentials.username - username
       * @param credentials.password - password
       */
      localLogin: async ({
        password,
        username,
      }: {
        username: string;
        password: string;
      }) => {
        await fetch(`${evergreenAppURL}/login`, {
          body: JSON.stringify({ password, username }),
          credentials: "include",
          method: "POST",
        }).then((response) => {
          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            // I know we don't like using alerts but this is a dev only feature
            alert("Error logging in, username or password invalid");
          }
        });
      },
      /**
       * logoutAndRedirect - calls the logout endpoint for localAuth
       * or redirects to the remoteAuthURL for remoteAuth.
       */
      logoutAndRedirect: async () => {
        // If we are authenticated, call the logout endpoint
        if (isAuthenticated) {
          try {
            await fetch(`${evergreenAppURL}/logout`, {
              credentials: "include",
              method: "GET",
              redirect: "manual",
              headers: getUserStagingHeader(),
            });
          } catch (error) {
            console.error("Error logging out", error);
          }
        }

        if (shouldUseLocalAuth) {
          setIsAuthenticated(false);
          navigate(localAuthRoute);
        } else {
          // Remote auth: just redirect to remoteAuthURL
          setIsAuthenticated(false);
          const encodedOrigin = encodeURIComponent(window.location.href);
          // TODO: The redirect URL does not work as expected because evergreen does not properly support it.
          const redirectURL = `${remoteAuthURL}?redirect=${encodedOrigin}`;
          window.location.href = redirectURL;
        }
      },
      /**
       * A helper to mark the user as authenticated in local state
       * (useful if you get a successful check from somewhere else).
       */
      dispatchAuthenticated: () => {
        setIsAuthenticated(true);
      },
    }),
    [
      isAuthenticated,
      evergreenAppURL,
      localAuthRoute,
      remoteAuthURL,
      shouldUseLocalAuth,
      navigate,
    ],
  );

  useEffect(() => {
    // Testing if the user is authenticated
    fetchWithRetry(`${evergreenAppURL}/graphql/query`, {
      credentials: "include",
      headers: {
        ...getUserStagingHeader(),
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query: "{\n  user {\n    userId\n  }\n}",
        variables: {},
      }),
      method: "POST",
      mode: "cors",
    })
      .then(() => {
        setIsAuthenticated(true);
        console.log("User is authenticated (local)");
      })
      .catch(() => {
        console.log("User is not authenticated");
        setIsAuthenticated(false);
        authMethods.logoutAndRedirect();
      });
  }, []);

  const authProviderValue = useMemo(
    () => ({ isAuthenticated, ...authMethods }),
    [isAuthenticated, authMethods],
  );

  return (
    <AuthStateContext.Provider value={authProviderValue}>
      {children}
    </AuthStateContext.Provider>
  );
};

const useAuthProviderContext = (): AuthState & AuthProviderDispatchMethods => {
  const authState = useContext(AuthStateContext);
  if (authState === null || authState === undefined) {
    throw new Error(
      "useAuthStateContext must be used within an auth context provider",
    );
  }
  return authState;
};

export { AuthProvider, useAuthProviderContext };
