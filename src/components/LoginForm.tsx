import React, { useState, useContext, useEffect } from "react";
import { useApiMutation } from "../hooks/useApiQuery";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";

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


        toast.success("Login successful!");

        setTimeout(() => {
          navigate("/");
        }, 2000);

      },
      onError: (err: Error) => {
        setError(err.message || "Login failed");
      },
    });
  };



  return (
  <div >

    <form onSubmit={handleSubmit} autoComplete="off">
      <div>
        <div className="form-group">
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

        <div className="form-group">
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

      <div className="form-group">
        <button type="submit" disabled={loginMutation.isLoading}>
          {loginMutation.isLoading ? (
            <div>
              <div></div>
            </div>
          ) : (
            "Sign In"
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