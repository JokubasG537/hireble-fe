import React, { useState, useContext } from "react";
import { useApiMutation } from "../hooks/useApiQuery";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const { dispatch } = useContext(UserContext);
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loginMutation = useApiMutation<{ user: any; token: string }, LoginForm>(
    "/users/login",
    "POST"
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    loginMutation.mutate(form, {
      onSuccess: (data) => {
        dispatch({ type: "LOGIN", payload: { user: data.user, token: data.token } });
        navigate("/");
      },
      onError: (err: any) => {
        setError(err.message || "Login failed");
      },
    });
  };



  return (
    <div className="register-form" style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="register-form__field-group">
          <div className="register-form__input-field">
            <label className="register-form__label" htmlFor="email">Email</label>
            <input
              className="register-form__input"
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>
          <div className="register-form__input-field">
            <label className="register-form__label" htmlFor="password">Password</label>
            <input
              className="register-form__input"
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="register-form__actions">
          <button
            type="submit"
            className="register-form__submit-button"
            disabled={loginMutation.isLoading}
          >
            {loginMutation.isLoading ? (
              <div className="register-form__loading-spinner">
                <div className="register-form__spinner-inner"></div>
              </div>
            ) : (
              "Login"
            )}
          </button>
        </div>
        {error && <div className="register-form__error">{error}</div>}
        {loginMutation.isSuccess && (
          <div style={{ color: "green" }}>Login successful!</div>
        )}
      </form>
    </div>
  );
}