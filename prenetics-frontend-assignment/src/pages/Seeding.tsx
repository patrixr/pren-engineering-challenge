import { useState } from 'react';
import { useOrganisations } from '../hooks/organisations';
import { TestApi } from '../services/test';

const api = new TestApi();

const Seeding = () => {
  const { selectedOrganisation } = useOrganisations();
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateDummyData = async () => {
    if (!selectedOrganisation) return;
    
    setIsLoading(true);
    const createdData = [];
    
    try {
      for (let i = 0; i < 10; i++) {
        // Create profile
        const profile = await api.createDummyProfile(selectedOrganisation.id);
        
        // Create result for this profile
        const result = await api.createDummyResult(
          selectedOrganisation.id,
          profile.data.id
        );
        
        createdData.push({ profile: profile.data, result: result.data });
      }
      
      setResults(createdData);
    } catch (error) {
      console.error('Error creating dummy data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Seeding</h1>
        <p className="text-gray-600">
          Click the button below to create 10 profiles with one dummy result each.
          This will create the data for the currently selected organisation.
        </p>
        
        <button
          onClick={handleCreateDummyData}
          disabled={isLoading || !selectedOrganisation}
          className="btn btn-primary"
        >
          {isLoading ? 'Creating...' : 'Create 10 Profiles with Results'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Created Data:</h2>
          <pre className="bg-base-200 p-4 rounded-lg overflow-auto max-h-[500px]">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Seeding;