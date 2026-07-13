import {type FormEvent, useState} from "react";
import {Link, useNavigate} from "react-router";

import {registerUser} from "../api/auth";

export function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") ?? "");
    const email = String(formData.get("email") ?? "");
    const displayName = String(formData.get("displayName") ?? "");
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await registerUser({
        username,
        email,
        password,
        display_name: displayName,
      });

      navigate("/login", {replace: true});
    } catch {
      setError("Unable to create this account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-panel" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">EaseCook</p>
          <h1>Create account</h1>
        </div>

        <label>
          Username
          <input autoComplete="username" name="username" required type="text"/>
        </label>

        <label>
          Email
          <input autoComplete="email" name="email" type="email"/>
        </label>

        <label>
          Display name
          <input autoComplete="name" name="displayName" type="text"/>
        </label>

        <label>
          Password
          <input
            autoComplete="new-password"
            name="password"
            required
            type="password"
          />
        </label>

        <label>
          Confirm password
          <input
            autoComplete="new-password"
            name="confirmPassword"
            required
            type="password"
          />
        </label>

        {error !== null ? <p className="form-error">{error}</p> : null}

        <button disabled={isSubmitting} type="submit">
          Create account
        </button>

        <p className="form-helper">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
