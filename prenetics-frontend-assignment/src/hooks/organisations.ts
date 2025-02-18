import { useContext, useEffect } from "react";
import { OrganisationContext } from "../context/OrganisationContext";
import { TestApi } from '../services/test';
import { useQuery } from "@tanstack/react-query";

const api = new TestApi();

export const useOrganisations = () => {
  const context = useContext(OrganisationContext);

  if (!context) {
    throw new Error('useOrganisation must be used within an OrganisationProvider');
  }

  const { selectedOrganisation, setSelectedOrganisation } = context;

  const { data: organisations, isLoading, error } = useQuery({
    queryKey: ['organisations'],
    queryFn: () => api.listOrganisations(),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!selectedOrganisation && organisations?.data.length) {
      setSelectedOrganisation(organisations.data[0]);
    }
  }, [selectedOrganisation, organisations, setSelectedOrganisation]);

  return {
    ...context,
    organisations,
    isLoading,
    error
  };
};