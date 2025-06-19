import React, { useState, useContext } from "react";
import { useApiMutation } from "../hooks/useApiQuery";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';

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
  <form onSubmit={handleSubmit}>
    <div className="">
      <div className="form-group">
        <label htmlFor="name">Company Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div  className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
      </div>

      <div  className="form-group">
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          value={form.location}
          onChange={handleChange}
          required
        />
      </div>

      <div  className="form-group">
        <label htmlFor="website">Website</label>
        <input
          type="url"
          id="website"
          name="website"
          value={form.website}
          onChange={handleChange}
          required
        />
      </div>

      <div  className="form-group">
        <label htmlFor="industry">Industry</label>
        <input
          type="text"
          id="industry"
          name="industry"
          value={form.industry}
          onChange={handleChange}
          required
        />
      </div>

      <div  className="form-group">
        <label htmlFor="logoUrl">Logo URL (optional)</label>
        <input
          type="url"
          id="logoUrl"
          name="logoUrl"
          value={form.logoUrl}
          onChange={handleChange}
        />
      </div>
    </div>

    <div  className="form-group">
      <button
        type="submit"
        disabled={createCompanyMutation.isLoading}
      >
        {createCompanyMutation.isLoading ? (
          <div>
            <div></div>
          </div>
        ) : (
          "Create Company"
        )}
      </button>
    </div>

    {error && (
      <div>
        {error}
      </div>
    )}

    {createCompanyMutation.isSuccess && (
      <div>
        Company created successfully!
      </div>
    )}
  </form>
);

}
