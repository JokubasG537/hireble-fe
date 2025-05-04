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

  // Cancel editing mode
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
    <div>
      <h1>{company ? "Manage Company" : "Create Company"}</h1>

      {errorMessage && (
        <div>{errorMessage}</div>
      )}

      {successMessage && (
        <div>{successMessage}</div>
      )}

      {(!company || isEditing) ? (

        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Company Name*
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>
              Industry*
            </label>
            <select
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

          <div>
            <label>
              Location*
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>
              Website*
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>
              Logo URL
            </label>
            <input
              type="url"
              name="logoUrl"
              value={formData.logoUrl || ""}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div>
            <label>
              Description*
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            ></textarea>
          </div>

          <div>
            <button type="submit">
              {company ? "Update Company" : "Create Company"}
            </button>

            {isEditing && (
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : (

        <div>
          <div>
            <h2>{company.name}</h2>
            {company.logoUrl && (
              <div>
                <img src={company.logoUrl} alt={`${company.name} logo`} />
              </div>
            )}
            <p><strong>Industry:</strong> {company.industry}</p>
            <p><strong>Location:</strong> {company.location}</p>
            <p><strong>Website:</strong> <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a></p>
            <p><strong>Description:</strong> {company.description}</p>
            <p><strong>Registered since:</strong> {new Date(company.createdAt).toLocaleDateString()}</p>
            {company.jobPosts && (
              <p><strong>Job Posts:</strong> {company.jobPosts.length}</p>
            )}
            {company.recruiters && (
              <p><strong>Recruiters:</strong> {company.recruiters.length}</p>
            )}
          </div>

          <div>
            <button onClick={() => setIsEditing(true)}>
              Edit Company
            </button>

            <button onClick={() => setShowDeleteConfirm(true)}>
              Delete Company
            </button>
          </div>

          {showDeleteConfirm && (
            <div>
              <p>Are you sure you want to delete this company? This action cannot be undone.</p>
              <button onClick={handleDelete}>
                Confirm Delete
              </button>
              <button onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyManager;
