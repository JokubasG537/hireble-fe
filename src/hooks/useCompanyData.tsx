import { useContext } from 'react';
import { UserContext } from "../contexts/UserContext";
import { useApiQuery } from "../hooks/useApiQuery";

export function useCompanyData(companyId?: string) {
  const { token } = useContext(UserContext);

  const endpoint = companyId
    ? `/companies/${companyId}`
    : "/companies/current/company";

  return useApiQuery(
    ["company", companyId || "current"],
    endpoint,
    !!token
  );
}
