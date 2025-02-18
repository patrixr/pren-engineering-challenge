import React from 'react';
import { useOrganisations } from '../hooks/organisations';

const NavBar = () => {
  const { organisations, selectedOrganisation, setSelectedOrganisation, isLoading } = useOrganisations();

  if (selectedOrganisation && !organisations?.data.find(org => org.id === selectedOrganisation.id)) {
    setSelectedOrganisation(null);
  }

  return (
    <div className="navbar bg-base-200 fixed">
      <div className="flex-1 px-2 lg:flex-none">
        <a className="text-lg font-bold">Prenetics</a>
      </div>
      <div className="flex flex-1 justify-end px-2">
        <div className="flex items-stretch">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost rounded-btn flex items-center">
              {selectedOrganisation ? selectedOrganisation.attributes.name : 'Select Organisation'}
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-4 w-52 p-2 shadow">
              {isLoading ? (
                <li><a>Loading...</a></li>
              ) : (
                organisations?.data.map(org => (
                  <li key={org.id}>
                    <a onClick={() => setSelectedOrganisation(org)}>{org.attributes.name}</a>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;