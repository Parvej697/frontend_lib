import { useEffect, useState } from 'react';
import api from '../../../api/axios';
import PageHeader from '../../../components/PageHeader';
import Table from '../../../components/Table';

export default function MoviesReport() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/reports/movies').then(r => setMovies(r.data.data || [])).finally(() => setLoading(false));
  }, []);
  return (
    <div>
      <PageHeader title="Master List of Movies" subtitle={`${movies.length} records`} />
      {loading ? <p className="text-slate-500 text-sm">Loading...</p> : (
        <Table headers={['Serial No','Name','Director','Category','Status','Cost (₹)','Procurement Date']}
          rows={movies.map(m => [m.serialNo, m.name, m.authorName, m.category,
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.status==='AVAILABLE'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{m.status}</span>,
            m.cost, m.procurementDate])} emptyMsg="No movies found." />
      )}
    </div>
  );
}
