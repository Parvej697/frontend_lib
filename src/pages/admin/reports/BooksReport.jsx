import { useEffect, useState } from 'react';
import api from '../../../api/axios';
import PageHeader from '../../../components/PageHeader';
import Table from '../../../components/Table';

export default function BooksReport() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/reports/books').then(r => setBooks(r.data.data || [])).finally(() => setLoading(false));
  }, []);
  return (
    <div>
      <PageHeader title="Master List of Books" subtitle={`${books.length} records`} />
      {loading ? <p className="text-slate-500 text-sm">Loading...</p> : (
        <Table headers={['Serial No','Name','Author','Category','Status','Cost (₹)','Procurement Date']}
          rows={books.map(b => [b.serialNo, b.name, b.authorName, b.category,
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${b.status==='AVAILABLE'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{b.status}</span>,
            b.cost, b.procurementDate])} emptyMsg="No books found." />
      )}
    </div>
  );
}
