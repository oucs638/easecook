import {useContext} from "react";

import {AuthContext} from "./AuthContext";

/**
 * Reads authentication state from AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
