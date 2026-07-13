import type {User} from "../api/types";

export type AuthStatus = "checking" | "authenticated" | "anonymous";

export interface AuthState {
  user: User | null;
  status: AuthStatus;
  error: string | null;
}

export type AuthAction =
  | { type: "checking" }
  | { type: "authenticated"; user: User }
  | { type: "anonymous" }
  | { type: "failed"; error: string };

export const initialAuthState: AuthState = {
  user: null,
  status: "checking",
  error: null,
};

/**
 * Updates authentication state from explicit session actions.
 */
export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "checking":
      return {
        ...state,
        status: "checking",
        error: null,
      };

    case "authenticated":
      return {
        user: action.user,
        status: "authenticated",
        error: null,
      };

    case "anonymous":
      return {
        user: null,
        status: "anonymous",
        error: null,
      };

    case "failed":
      return {
        user: null,
        status: "anonymous",
        error: action.error,
      };

    default:
      return state;
  }
}
