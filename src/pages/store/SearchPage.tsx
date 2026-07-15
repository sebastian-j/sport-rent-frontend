import { useSearchParams } from 'react-router-dom';

export default function SearchPage() {
  const [searchParams] = useSearchParams();

  return (
    <div>
      <p>Search Page</p>
      <p>{searchParams.get('q') ?? ''}</p>
    </div>
  );
}
