import React from "react";
import { RegisterForm } from "../pages/Register";

const roles = [
  { label: "User", value: "user" },
  { label: "Recruiter", value: "recruiter" },
];

interface Props {
  form: RegisterForm;
  setForm: React.Dispatch<React.SetStateAction<RegisterForm>>;
  onSubmit: () => void;
  isLoading: boolean;
  error: string | null;
}

export default function RegisterStep1UserForm({
  form,
  setForm,
  onSubmit,
  isLoading,
  error,
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Username</label>
      <input name="username" value={form.username} onChange={handleChange} required autoFocus />

      <label>Email</label>
      <input name="email" type="email" value={form.email} onChange={handleChange} required />

      <label>Password</label>
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        required
        minLength={6}
      />

      <label>Role</label>
      <select name="role" value={form.role} onChange={handleChange}>
        {roles.map((role) => (
          <option key={role.value} value={role.value}>
            {role.label}
          </option>
        ))}
      </select>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Registering..." : "Register"}
      </button>

      {error && <div>{error}</div>}
    </form>
  );
}
