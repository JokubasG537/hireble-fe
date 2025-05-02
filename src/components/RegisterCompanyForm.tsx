
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
  const [form, setForm] = useState<CompanyForm>({
    name: "",
    description: "",
    location: "",
    website: "",
    industry: "",
    logoUrl: "",
  });
  const [error, setError] = useState<string | null>(null);

  const createCompanyMutation = useApiMutation<any, CompanyForm>(
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
    <div>
      <h3>Register New Company</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Company Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
          />
        </div>
        <div>
          <label>Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Website</label>
          <input
            name="website"
            type="url"
            value={form.website}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Industry</label>
          <input
            name="industry"
            value={form.industry}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Logo URL (optional)</label>
          <input
            name="logoUrl"
            type="url"
            value={form.logoUrl}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={createCompanyMutation.isLoading}>
          {createCompanyMutation.isLoading ? "Creating..." : "Create Company"}
        </button>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {createCompanyMutation.isSuccess && (
          <div style={{ color: "green" }}>Company created successfully!</div>
        )}
      </form>
    </div>
  );
}
