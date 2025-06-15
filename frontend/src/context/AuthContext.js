import React, { createContext, useContext } from 'react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      cacheLocation="localstorage"
    >
      <InnerAuthProvider>{children}</InnerAuthProvider>
    </Auth0Provider>
  );
}

function InnerAuthProvider({ children }) {
  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
    isLoading,
  } = useAuth0();

  const login = () => loginWithRedirect();
  
  const getToken = async () => {
    try {
      return await getAccessTokenSilently();
    } catch (err) {
      console.error('Error getting token:', err);
      return null;
    }
  };

  const logout = () =>
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin,
        client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
      },
    });

  return (
    <AuthContext.Provider
      value={{
        // Provide both user and account for compatibility
        user,
        account: user, // Add this for backward compatibility
        userId: user?.sub,
        getToken,
        login,
        logout,
        isAuthenticated,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}