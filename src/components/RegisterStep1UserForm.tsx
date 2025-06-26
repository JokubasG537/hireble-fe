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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };
return (
  <form onSubmit={handleSubmit}>
    <div>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={form.username || ''}
          onChange={handleChange}
          placeholder="Enter your username"
          required
          autoFocus
        />
      </div>

      <div  className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email || ''}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />
      </div>

      <div  className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={form.password || ''}
          onChange={handleChange}
          placeholder="Enter your password"
          required
          minLength={6}
        />
      </div>

      <div  className="form-group">
        <div>Select your role:</div>
        <div>
          {roles.map((role) => (
            <div key={role.value}>
              <input
                type="radio"
                id={`role-${role.value}`}
                name="role"
                value={role.value}
                checked={form.role === role.value}
                onChange={handleChange}
              />
              <label htmlFor={`role-${role.value}`}>
                {role.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div  className="form-group">
      <button
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? (
          <div>
            <div></div>
          </div>
        ) : (
          "Register"
        )}
      </button>
    </div>

    {error && (
      <div>
        {error}
      </div>
    )}
  </form>
);

}
