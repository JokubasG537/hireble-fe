import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useApiQuery, useApiMutation } from "../hooks/useApiQuery";

interface Company {
  _id: string;
  name: string;
  description: string;
  location: string;
  website: string;
  industry: string;
  logoUrl?: string;
  jobPosts?: string[];
  recruiters?: string[];
  createdAt: string;
  updatedAt: string;
}

const emptyCompany = {
  name: "",
  description: "",
  location: "",
  website: "",
  industry: "",
  logoUrl: ""
};

const CompanyManager: React.FC = () => {
  const { token } = useContext(UserContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(emptyCompany);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");


  const {
    data: company,
    isLoading,
    error,
    refetch
  } = useApiQuery<Company>(
    ["user-company"],
    "/companies/current/company",
    !!token
  );


  const createMutation = useApiMutation(
    "/companies",
    "POST",
    ["user-company"]
  );

  const updateMutation = useApiMutation(
    "/companies/:id",
    "PUT",
    ["user-company"]
  );

  const deleteMutation = useApiMutation(
    "/companies/:id",
    "DELETE",
    ["user-company"]
  );

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        description: company.description || "",
        location: company.location || "",
        website: company.website || "",
        industry: company.industry || "",
        logoUrl: company.logoUrl || ""
      });
    }
  }, [company]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");


    if (!formData.name) {
      setErrorMessage("Company name is required");
      return;
    }
    if (!formData.description) {
      setErrorMessage("Description is required");
      return;
    }
    if (!formData.location) {
      setErrorMessage("Location is required");
      return;
    }
    if (!formData.website) {
      setErrorMessage("Website is required");
      return;
    }
    if (!formData.industry) {
      setErrorMessage("Industry is required");
      return;
    }

    if (company) {

      updateMutation.mutate(
        {
          __params: { id: company._id },
          ...formData
        },
        {
          onSuccess: () => {
            setSuccessMessage("Company updated successfully");
            setIsEditing(false);
            refetch();
            setTimeout(() => setSuccessMessage(""), 3000);
          },
          onError: (err: any) => {
            setErrorMessage(`Failed to update: ${err.message}`);
          }
        }
      );
    } else {

      createMutation.mutate(
        formData,
        {
          onSuccess: () => {
            setSuccessMessage("Company created successfully");
            refetch();
            setTimeout(() => setSuccessMessage(""), 3000);
          },
          onError: (err: any) => {
            setErrorMessage(`Failed to create: ${err.message}`);
          }
        }
      );
    }
  };


  const handleDelete = () => {
    if (!company) return;

    deleteMutation.mutate(
      { __params: { id: company._id } },
      {
        onSuccess: () => {
          setSuccessMessage("Company deleted successfully");
          setShowDeleteConfirm(false);
          setFormData(emptyCompany);
          refetch();
          setTimeout(() => {
            setSuccessMessage("");
            navigate("/dashboard");
          }, 3000);
        },
        onError: (err: any) => {
          setErrorMessage(`Failed to delete: ${err.message}`);
          setShowDeleteConfirm(false);
        }
      }
    );
  };

  const handleCancel = () => {
    if (company) {
      setFormData({
        name: company.name || "",
        description: company.description || "",
        location: company.location || "",
        website: company.website || "",
        industry: company.industry || "",
        logoUrl: company.logoUrl || ""
      });
    } else {
      setFormData(emptyCompany);
    }
    setIsEditing(false);
    setErrorMessage("");
  };

  if (isLoading) return <div>Loading company data...</div>;

  return (
    <div className="company-management">
      {errorMessage && (
        <div className="form-alert form-alert--error">{errorMessage}</div>
      )}

      {successMessage && (
        <div className="form-alert form-alert--success">{successMessage}</div>
      )}

      {(!company || isEditing) ? (
        <form className="company-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Company Name*
            </label>
            <input
              className="form-input"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Industry*
            </label>
            <select
              className="form-input"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              required
            >
              <option value="">Select Industry</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Retail">Retail</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Location*
            </label>
            <input
              className="form-input"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Website*
            </label>
            <input
              className="form-input"
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Logo URL
            </label>
            <input
              className="form-input"
              type="url"
              name="logoUrl"
              value={formData.logoUrl || ""}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Description*
            </label>
            <textarea
              className="form-textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            ></textarea>
          </div>

          <div className="form-actions">
            <button className="btn btn--primary" type="submit">
              {company ? "Update Company" : "Create Company"}
            </button>

            {isEditing && (
              <button className="btn btn--secondary" type="button" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="company-details">
          <div className="company-header">
            <h2 className="company-title">{company.name}</h2>
            {company.logoUrl && (
              <div className="company-logo">
                <img src={company.logoUrl} alt={`${company.name} logo`} />
              </div>
            )}
          </div>

          <div className="company-info">
            <p className="detail-item"><strong>Industry:</strong> {company.industry}</p>
            <p className="detail-item"><strong>Location:</strong> {company.location}</p>
            <p className="detail-item">
              <strong>Website:</strong> <a className="company-link" href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a>
            </p>
            <p className="detail-item"><strong>Description:</strong> {company.description}</p>
            <p className="detail-item"><strong>Registered since:</strong> {new Date(company.createdAt).toLocaleDateString()}</p>
            {company.jobPosts && (
              <p className="detail-item"><strong>Job Posts:</strong> {company.jobPosts.length}</p>
            )}
            {company.recruiters && (
              <p className="detail-item"><strong>Recruiters:</strong> {company.recruiters.length}</p>
            )}
          </div>

          <div className="company-actions">
            <button className="btn btn--edit" onClick={() => setIsEditing(true)}>
              Edit Company
            </button>
            <button className="btn btn--delete" onClick={() => setShowDeleteConfirm(true)}>
              Delete Company
            </button>
          </div>

          {showDeleteConfirm && (
            <div className="delete-confirm">
              <p className="delete-warning">Are you sure you want to delete this company? This action cannot be undone.</p>
              <div className="confirm-actions">
                <button className="btn btn--danger" onClick={handleDelete}>
                  Confirm Delete
                </button>
                <button className="btn btn--secondary" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyManager;
