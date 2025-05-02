import React, { useState, useEffect, useContext } from "react";
import { useApiQuery, useApiMutation } from "../hooks/useApiQuery";
import { UserContext } from "../contexts/UserContext";

interface Company {
  _id: string;
  name: string;
  industry?: string;
  location?: string;
}

export default function CompanySearchAutocomplete() {
  const { dispatch } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);


  useEffect(() => {
    const handler = setTimeout(() => setDebouncedTerm(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);


  const { data, isLoading, error } = useApiQuery<{ companies: Company[] }>(
    ["companies", debouncedTerm],
    `/companies?search=${encodeURIComponent(debouncedTerm)}`,
    debouncedTerm.length > 2
  );

 
  const joinRequestMutation = useApiMutation(
    "/companyJoinRequests",
    "POST",
    ["companyJoinRequests"]
  );

  const handleJoinRequest = async (companyId: string) => {
    if (!companyId) return;

    joinRequestMutation.mutate(
      { companyId },
      {
        onSuccess: () => {
          setSearchTerm("");
          setSelectedCompany(null);
          dispatch({ type: "UPDATE_USER", payload: { joinRequestSent: true } });
        },
        onError: (error) => {
          console.error("Join request failed:", error);
        },
      }
    );
  };

  return (
    <div className="autocomplete-wrapper">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoComplete="off"
        />

        {isLoading && <div className="loading-indicator">Searching...</div>}
        {error && <div className="error-message">Error: {error.message}</div>}
      </div>

      {data?.companies && data.companies.length > 0 && (
        <ul className="suggestions-list">
          {data.companies.map((company) => (
            <li key={company._id} className="company-item">
              <div className="company-info">
                <span className="company-name">{company.name}</span>
                {company.industry && (
                  <span className="company-industry">{company.industry}</span>
                )}
                {company.location && (
                  <span className="company-location">{company.location}</span>
                )}
              </div>
              <button
                onClick={() => handleJoinRequest(company._id)}
                disabled={joinRequestMutation.isLoading}
                className="request-button"
              >
                {joinRequestMutation.isLoading ? "Sending..." : "Request to Join"}
              </button>
            </li>
          ))}
        </ul>
      )}

      {joinRequestMutation.isSuccess && (
        <div className="success-message">
          ✓ Join request sent successfully!
        </div>
      )}
    </div>
  );
}
