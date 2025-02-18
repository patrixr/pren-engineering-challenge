import { useSearch } from '../hooks/search';
import { useOrganisations } from '../hooks/organisations';
import { useSearchParams } from 'react-router-dom';
import { useCallback, useState, useEffect } from 'react';
import { debounce } from '../utils/debounce';
import ErrorBox from '../components/ErrorBox';
import { Organisation } from '../entities/organisation';

interface ColumnVisibility {
  patientId: boolean;
  sampleCode: boolean;
  resultType: boolean;
  activationDate: boolean;
  resultDate: boolean;
}

const COLUMNS = [
  { id: 'patientId', label: 'Patient ID' },
  { id: 'sampleCode', label: 'Sample Code' },
  { id: 'resultType', label: 'Result Type' },
  { id: 'activationDate', label: 'Activation Date' },
  { id: 'resultDate', label: 'Result Date' },
] as const;

const getColumnVisibility = (selectedOrganisation?: Organisation | null) => {
    if (!selectedOrganisation) return {
      patientId: true,
      sampleCode: true,
      resultType: true,
      activationDate: true,
      resultDate: true,
    };
    
    const stored = localStorage.getItem(`columnVisibility_${selectedOrganisation.id}`);
    return stored ? JSON.parse(stored) : {
      patientId: true,
      sampleCode: true,
      resultType: true,
      activationDate: true,
      resultDate: true,
    };
}

const PatientManagement = () => {
  const { selectedOrganisation } = useOrganisations();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');
  const pageSize = 15;
  const [searchInput, setSearchInput] = useState(searchParams.get('query') || '');
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(() => getColumnVisibility(selectedOrganisation));

  // ---------------------
  // Column Visibility
  // ---------------------

  useEffect(() => {
    if (!selectedOrganisation) return;
    localStorage.setItem(
      `columnVisibility_${selectedOrganisation.id}`,
      JSON.stringify(columnVisibility)
    );
  }, [columnVisibility]);

  useEffect(() => {
    if (!selectedOrganisation) return
    const stored = localStorage.getItem(`columnVisibility_${selectedOrganisation.id}`);
    if (stored) {
      setColumnVisibility(JSON.parse(stored));
    }
  }, [selectedOrganisation]);

  const toggleColumn = (columnId: keyof ColumnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnId]: !prev[columnId]
    }));
  };

  // ---------------------
  // Search
  // ---------------------

  const { data, isLoading, error } = useSearch({
    pageOffset: (currentPage - 1),
    pageLimit: pageSize,
    include: ["resultType"],
    q: searchInput
  });

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString(), query: searchInput });
  };

  const handleSearchChange = useCallback(debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  }), [])

  if (!selectedOrganisation) {
    return <div>Please select an organisation</div>;
  }

  if (error) {
    return <ErrorBox message={error.message} />
  }

  const totalPages = data?.meta?.pageCount || 0

  const findPatientName = (profileId?: string) => {
    if (!profileId) return "n/a";
    return data?.included.find(d => d.type === "profile" && d.id === profileId)?.attributes?.name || "Unknown";
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Patient Management
        <span className={isLoading ? '' : 'hidden' + " ml-2 loading loading-spinner text-info"}></span>
      </h1>

      <div className="flex justify-between items-center mb-4">
        {/* Search box */}
        <input
          type="text"
          defaultValue={searchInput}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="input input-bordered w-full max-w-xs"
        />
        
        {/* Dropdown toggle options */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
            Columns
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            {COLUMNS.map(({ id, label }) => (
              <li key={id}>
                <label className="label cursor-pointer">
                  <span className="label-text">{label}</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-sm"
                    checked={columnVisibility[id as keyof ColumnVisibility]}
                    onChange={() => toggleColumn(id as keyof ColumnVisibility)}
                  />
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table table-xs">
          <thead>
            <tr>
              <th>Patient</th>
              {columnVisibility.patientId && <th>Patient Id</th>}
              {columnVisibility.sampleCode && <th>Sample Code</th>}
              {columnVisibility.resultType && <th>Result Type</th>}
              <th>Result</th>
              {columnVisibility.activationDate && <th>Activation Date</th>}
              {columnVisibility.resultDate && <th>Result Date</th>}
            </tr>
          </thead>
          <tbody>
            {(data?.data ?? []).map((result) => (
              <tr key={result.id}>
                <td>{findPatientName(result.relationships?.profile?.data?.id)}</td>
                {columnVisibility.patientId && <td>{result.relationships?.profile?.data?.id}</td>}
                {columnVisibility.sampleCode && <td>{result.attributes.sampleId}</td>}
                {columnVisibility.resultType && <td>{result.attributes.resultType}</td>}
                <td>{result.attributes.result || 'N/A'}</td>
                {columnVisibility.activationDate && 
                  <td>{new Date(result.attributes.activateTime).toLocaleDateString()}</td>}
                {columnVisibility.resultDate && 
                  <td>{result.attributes.resultTime ? 
                    new Date(result.attributes.resultTime).toLocaleDateString() : 'N/A'}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="join">
            <button
              className="join-item btn btn-sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              «
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`join-item btn btn-sm ${currentPage === page ? 'btn-active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="join-item btn btn-sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;