import { useQuery } from '@tanstack/react-query';
import { TestApi } from '../services/test';
import type { SearchOptions } from '../services/test';
import { useOrganisations } from './organisations';

const api = new TestApi();

export const useSearch = (options: SearchOptions = {}) => {
  const { selectedOrganisation } = useOrganisations();

  return useQuery({
    queryKey: ['search-results', options, selectedOrganisation?.id],
    queryFn: () => api.searchResults(selectedOrganisation?.id!, options),
    enabled: !!selectedOrganisation, // Only enable query if an organisation is selected
    retry: false,
  });
};