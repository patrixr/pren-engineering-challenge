import { createContext, useState, useEffect, ReactNode } from 'react';
import { Organisation } from '../entities/organisation';

interface OrganisationContextType {
  selectedOrganisation: Organisation | null;
  setSelectedOrganisation: (organisation: Organisation) => void;
}

export const OrganisationContext = createContext<OrganisationContextType | undefined>(undefined);

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
