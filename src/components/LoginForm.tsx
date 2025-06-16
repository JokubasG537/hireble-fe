import React, { useState, useContext } from "react";
import { useApiMutation } from "../hooks/useApiQuery";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginForm() {
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
  <div style={{ maxWidth: 400, margin: "2rem auto" }}>
    <h2>Login</h2>
    <form onSubmit={handleSubmit} autoComplete="off">
      <div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <button type="submit" disabled={loginMutation.isLoading}>
          {loginMutation.isLoading ? (
            <div>
              <div></div>
            </div>
          ) : (
            "Login"
          )}
        </button>
      </div>

      {error && <div>{error}</div>}
      {loginMutation.isSuccess && (
        <div style={{ color: "green" }}>Login successful!</div>
      )}
    </form>
  </div>
);

}