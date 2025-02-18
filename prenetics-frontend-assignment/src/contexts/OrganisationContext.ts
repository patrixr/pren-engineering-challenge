import { createContext } from 'react';
import { Organisation } from '../entities/organisation';

interface OrganisationContextType {
  selectedOrganisation: Organisation | null;
  setSelectedOrganisation: (organisation: Organisation | null) => void;
}

export const OrganisationContext = createContext<OrganisationContextType | undefined>(undefined);
