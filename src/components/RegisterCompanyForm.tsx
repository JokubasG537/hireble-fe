import React, { useState, useContext } from "react";
import { useApiMutation } from "../hooks/useApiQuery";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

interface CompanyForm {
  name: string;
  description: string;
  location: string;
  website: string;
  industry: string;
  logoUrl?: string;
}

export default function RegisterCompanyForm() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    website: "",
    industry: "",
    logoUrl: "",
  });
  const [error, setError] = useState(null);
  const createCompanyMutation = useApiMutation(
    "/companies",
    "POST"
  );
  const assignCompanyMutation = useApiMutation(
    `/users/company`,
    "PATCH"
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    createCompanyMutation.mutate(form, {
      onSuccess: (data) => {
        const newCompanyId = data.company._id;
        assignCompanyMutation.mutate(
          { companyId: newCompanyId },
          {
            onSuccess: () => {
              navigate("/dashboard");
            },
            onError: (err: any) => {
              setError("Company created but failed to assign: " + err.message);
            }
          }
        );
      },
      onError: (err: any) => {
        setError(err.message || "Failed to create company");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="register-form side-form">
      <div className="register-form__field-group">
        <div className="register-form__input-field">
          <label htmlFor="name" className="register-form__label">Company Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="register-form__input"
            required
          />
        </div>

        <div className="register-form__input-field">
          <label htmlFor="description" className="register-form__label">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="register-form__input"
            required
          />
        </div>

        <div className="register-form__input-field">
          <label htmlFor="location" className="register-form__label">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="register-form__input"
            required
          />
        </div>

        <div className="register-form__input-field">
          <label htmlFor="website" className="register-form__label">Website</label>
          <input
            type="url"
            id="website"
            name="website"
            value={form.website}
            onChange={handleChange}
            className="register-form__input"
            required
          />
        </div>

        <div className="register-form__input-field">
          <label htmlFor="industry" className="register-form__label">Industry</label>
          <input
            type="text"
            id="industry"
            name="industry"
            value={form.industry}
            onChange={handleChange}
            className="register-form__input"
            required
          />
        </div>

        <div className="register-form__input-field">
          <label htmlFor="logoUrl" className="register-form__label">Logo URL (optional)</label>
          <input
            type="url"
            id="logoUrl"
            name="logoUrl"
            value={form.logoUrl}
            onChange={handleChange}
            className="register-form__input"
          />
        </div>
      </div>

      <div className="register-form__actions">
        <button
          type="submit"
          className="register-form__submit-button"
          disabled={createCompanyMutation.isLoading}
        >
          {createCompanyMutation.isLoading ? (
            <div className="register-form__loading-spinner">
              <div className="register-form__spinner-inner"></div>
            </div>
          ) : (
            "Create Company"
          )}
        </button>
      </div>

      {error && (
        <div className="register-form__error">
          {error}
        </div>
      )}

      {createCompanyMutation.isSuccess && (
        <div className="register-form__success">
          Company created successfully!
        </div>
      )}
    </form>
  );
}
