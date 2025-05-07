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
    <form onSubmit={handleSubmit} className="register-form">
      <div className="register-form__field-group">
        <div className="register-form__input-field">
          <label htmlFor="username" className="register-form__label">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={form.username || ''}
            onChange={handleChange}
            className="register-form__input"
            placeholder="Enter your username"
            required
            autoFocus
          />
        </div>

        <div className="register-form__input-field">
          <label htmlFor="email" className="register-form__label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email || ''}
            onChange={handleChange}
            className="register-form__input"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="register-form__input-field">
          <label htmlFor="password" className="register-form__label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password || ''}
            onChange={handleChange}
            className="register-form__input"
            placeholder="Enter your password"
            required
            minLength={6}
          />
        </div>

        <div className="register-form__role-selector">
          <div className="register-form__role-label">Select your role:</div>
          <div className="register-form__radio-group">
            {roles.map((role) => (
              <div key={role.value} className="register-form__radio-wrapper">
                <input
                  type="radio"
                  id={`role-${role.value}`}
                  name="role"
                  value={role.value}
                  checked={form.role === role.value}
                  onChange={handleChange}
                  className="register-form__radio-input"
                />
                <label
                  htmlFor={`role-${role.value}`}
                  className="register-form__radio-label"
                >
                  {role.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="register-form__actions">
        <button
          type="submit"
          className="register-form__submit-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="register-form__loading-spinner">
              <div className="register-form__spinner-inner"></div>
            </div>
          ) : (
            "Register"
          )}
        </button>
      </div>

      {error && (
        <div className="register-form__error">
          {error}
        </div>
      )}
    </form>
  );
}
