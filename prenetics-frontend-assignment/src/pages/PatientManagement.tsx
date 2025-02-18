import ErrorBox from '../components/ErrorBox';
import { useSearch } from '../hooks/search';

const PatientManagement = () => {
  const { data, isLoading, error } = useSearch({
    pageLimit: 10,
    pageOffset: 0
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <ErrorBox message={error.message} />;

  return (
    <div>
      {data?.data.map(result => (
        <div key={result.id}>
          {result.attributes.sampleId}
        </div>
      ))}
    </div>
  );
};

export default PatientManagement