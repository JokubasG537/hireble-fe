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
  <div className="wrapper">
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        aria-label="Company selection tabs"
        TabIndicatorProps={{ style: { backgroundColor: '#2557a7' } }}
      >
        <Tab
          label="Existing Company"
          sx={{
            color: '#000000',
            '&.Mui-selected': {
              color: '#2557a7',
            },
            '&:hover': {
              color: '#2557a7',
            },
          }}
        />
        <Tab
          label="New Company"
          sx={{
            color: '#000000',
            '&.Mui-selected': {
              color: '#2557a7',
            },
            '&:hover': {
              color: '#2557a7',
            },
          }}
        />
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
