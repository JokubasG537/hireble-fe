// src/pages/Login.tsx
import React, { useState, useContext } from "react";
import { useApiMutation } from "../hooks/useApiQuery";
import { UserContext } from "../contexts/UserContext";

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const { dispatch } = useContext(UserContext);
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

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
      },
      onError: (err: any) => {
        setError(err.message || "Login failed");
      },
    });
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div>
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            autoFocus
          />
        </div>
        <div>
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loginMutation.isLoading}>
          {loginMutation.isLoading ? "Logging in..." : "Login"}
        </button>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {loginMutation.isSuccess && (
          <div style={{ color: "green" }}>Login successful!</div>
        )}
      </form>
    </div>
  );
}
