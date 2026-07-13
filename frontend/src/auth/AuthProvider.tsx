import {type ReactNode, useCallback, useEffect, useMemo, useReducer,} from "react";

import {getCurrentUser, login as loginRequest, logout as logoutRequest} from "../api/auth";
import {getAccessToken} from "../api/tokenStorage";
import type {LoginPayload} from "../api/types";
import {AuthContext, type AuthContextValue} from "./AuthContext";
import {authReducer, initialAuthState} from "./sessionReducer";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Owns browser session state and exposes auth actions to the app.
 */
export function AuthProvider({children}: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    let isActive = true;

    async function restoreSession(): Promise<void> {
      if (getAccessToken() === null) {
        dispatch({type: "anonymous"});
        return;
      }

      try {
        const user = await getCurrentUser();

        if (isActive) {
          dispatch({type: "authenticated", user});
        }
      } catch {
        logoutRequest();

        if (isActive) {
          dispatch({type: "anonymous"});
        }
      }
    }

    void restoreSession();

    return () => {
      isActive = false;
    };
  }, []);

  const login = useCallback(async (payload: LoginPayload): Promise<void> => {
    dispatch({type: "checking"});

    try {
      await loginRequest(payload);
      const user = await getCurrentUser();

      dispatch({type: "authenticated", user});
    } catch {
      dispatch({
        type: "failed",
        error: "Unable to sign in with those credentials.",
      });

      throw new Error("Unable to sign in with those credentials.");
    }
  }, []);

  const logout = useCallback((): void => {
    logoutRequest();
    dispatch({type: "anonymous"});
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      logout,
    }),
    [state, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
