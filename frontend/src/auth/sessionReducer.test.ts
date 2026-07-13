import {describe, expect, it} from "vitest";

import type {User} from "../api/types";
import {authReducer, initialAuthState} from "./sessionReducer";

const sampleUser: User = {
  id: 1,
  username: "demo_user",
  email: "demo@example.com",
};

describe("authReducer", () => {
  it("stores the authenticated user", () => {
    const state = authReducer(initialAuthState, {
      type: "authenticated",
      user: sampleUser,
    });

    expect(state).toEqual({
      user: sampleUser,
      status: "authenticated",
      error: null,
    });
  });

  it("clears the current user when the session becomes anonymous", () => {
    const authenticatedState = authReducer(initialAuthState, {
      type: "authenticated",
      user: sampleUser,
    });

    const state = authReducer(authenticatedState, {type: "anonymous"});

    expect(state).toEqual({
      user: null,
      status: "anonymous",
      error: null,
    });
  });

  it("stores an error when authentication fails", () => {
    const state = authReducer(initialAuthState, {
      type: "failed",
      error: "Invalid credentials.",
    });

    expect(state).toEqual({
      user: null,
      status: "anonymous",
      error: "Invalid credentials.",
    });
  });
});
