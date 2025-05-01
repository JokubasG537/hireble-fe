// src/pages/Register.tsx
import React, { useState, useContext } from "react";
import { useApiMutation } from "../hooks/useApiQuery";
import { UserContext } from "../contexts/UserContext";

const roles = [
  { label: "User", value: "user" },
  { label: "Recruiter", value: "recruiter" },
  { label: "Admin", value: "admin" },
];

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  role: "user" | "recruiter" | "admin";
}

export default function Register() {
  const { dispatch } = useContext(UserContext);
  const [form, setForm] = useState<RegisterForm>({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState<string | null>(null);

  const registerMutation = useApiMutation<{ user: any; token: string }, RegisterForm>(
    "/users/register",
    "POST"
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    registerMutation.mutate(form, {
      onSuccess: (data: any) => {
        dispatch({ type: "LOGIN", payload: { user: data.user, token: data.token } });
      },
      onError: (err: any) => {
        setError(err.message || "Registration failed");
      },
    });
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div>
          <label>Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            autoFocus
          />
        </div>
        <div>
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
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
            minLength={6}
          />
        </div>
        <div>
          <label>Role</label>
          <select name="role" value={form.role} onChange={handleChange}>
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={registerMutation.isLoading}>
          {registerMutation.isLoading ? "Registering..." : "Register"}
        </button>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {registerMutation.isSuccess && (
          <div style={{ color: "green" }}>Registration successful!</div>
        )}
      </form>
    </div>
  );
}
