import { ReactNode, useEffect, useState } from "react";
import { Organisation } from "../entities/organisation";
import { OrganisationContext } from "../contexts/OrganisationContext";

export const OrganisationProvider = ({ children }: { children: ReactNode }) => {
  const [selectedOrganisation, setSelectedOrganisation] = useState<Organisation | null>(() => {
    const savedOrganisation = localStorage.getItem('selectedOrganisation');
    return savedOrganisation ? JSON.parse(savedOrganisation) : null;
  });

  useEffect(() => {
    if (selectedOrganisation) {
      localStorage.setItem('selectedOrganisation', JSON.stringify(selectedOrganisation));
    }
  }, [selectedOrganisation]);

  return (
    <OrganisationContext.Provider value={{ selectedOrganisation, setSelectedOrganisation }}>
      {children}
    </OrganisationContext.Provider>
  );
};
