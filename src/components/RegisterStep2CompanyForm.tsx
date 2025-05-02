import React from "react";
import { useNavigate } from "react-router-dom";
import CompanySearchAutocomplete from "./CompanySearch";
import RegisterCompanyForm from "./RegisterCompanyForm";
export default function RegisterStep2CompanyForm() {
  const navigate = useNavigate();

  return (
    <div>
      <h3>Company Selection</h3>
      <div>
        <h4>Search for an existing company</h4>
        <CompanySearchAutocomplete />
      </div>
      <div>
        <h4>Register a new company</h4>
        <RegisterCompanyForm />
      </div>
    </div>
  );
}
