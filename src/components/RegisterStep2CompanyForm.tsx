import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tab, Tabs, Box, CircularProgress } from "@mui/material";
import CompanySearchAutocomplete from "./CompanySearch";
import RegisterCompanyForm from "./RegisterCompanyForm";

export default function RegisterStep2CompanyForm() {
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newTabIndex: number) => {
    setTabIndex(newTabIndex);
  };

  return (
    <div>
      {/* <h2 className="form-title">Company Selection</h2> */}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
  <Tabs
  className="tabs"
    value={tabIndex}
    onChange={handleTabChange}
    aria-label="Company selection tabs"
    textColor="inherit"
    TabIndicatorProps={{ style: { backgroundColor: '#000000' } }}
    sx={{ color: '#ffffff' }}
  >
    <Tab label="Search for Existing Company" sx={{ color: '#000000' }} />
    <Tab label="Register a New Company" sx={{ color: '#000000' }} />
  </Tabs>
</Box>

      {tabIndex === 0 && (
        <div>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <CompanySearchAutocomplete setIsLoading={setIsLoading} />
          )}
        </div>
      )}

      {tabIndex === 1 && (
        <div>
          <RegisterCompanyForm />
        </div>
      )}
    </div>
  );
}
