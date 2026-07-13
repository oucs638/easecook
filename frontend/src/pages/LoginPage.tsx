import {type FormEvent} from "react";
import {Link, Navigate, useLocation, useNavigate} from "react-router";

import {useAuth} from "../auth/useAuth";

interface LoginLocationState {
  from?: string;
}

export function LoginPage() {
  const {error, login, status} = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LoginLocationState | null;
  const redirectPath = state?.from ?? "/";

  if (status === "authenticated") {
    return <Navigate replace to={redirectPath}/>;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      await login({username, password});
      navigate(redirectPath, {replace: true});
    } catch {
      // AuthProvider stores the message shown below the form.
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-panel" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">EaseCook</p>
          <h1>Sign in</h1>
        </div>

        <label>
          Username
          <input autoComplete="username" name="username" required type="text"/>
        </label>

        <label>
          Password
          <input
            autoComplete="current-password"
            name="password"
            required
            type="password"
          />
        </label>

        {error !== null ? <p className="form-error">{error}</p> : null}

        <button disabled={status === "checking"} type="submit">
          Sign in
        </button>

        <p className="form-helper">
          New to EaseCook? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </main>
  );
}
