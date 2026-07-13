import {createContext} from "react";

import type {LoginPayload} from "../api/types";
import type {AuthState} from "./sessionReducer";

export interface AuthContextValue extends AuthState {
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
