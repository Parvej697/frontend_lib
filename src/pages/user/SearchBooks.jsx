import { useState } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import Alert from '../../components/Alert';

export default function SearchBooks() {
  const [type, setType]   = useState('BOOK');
  const [name, setName]   = useState('');
  const [author, setAuthor] = useState('');
  const [results, setResults] = useState(null);
  const [alert, setAlert] = useState({ type:'', msg:'' });
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!name.trim() && !author.trim()) {
      setAlert({ type:'error', msg:'Please enter a book name or author name before searching.' }); return;
    }
    setLoading(true); setAlert({ type:'', msg:'' });
    try {
      const params = new URLSearchParams({ type });
      if (name.trim())   params.set('name', name.trim());
      if (author.trim()) params.set('author', author.trim());
      const res = await api.get(`/books/search?${params}`);
      setResults(res.data.data || []);
      if ((res.data.data || []).length === 0) setAlert({ type:'info', msg:'No books found matching your search.' });
    } catch (err) {
      setAlert({ type:'error', msg: err.response?.data?.message || 'Search failed.' });
    } finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader title="Book Availability" subtitle="Search by book name or author. At least one field required." />
      <Card className="mb-5">
        <div className="flex gap-3 mb-4">
          {['BOOK','MOVIE'].map(t => (
            <button key={t} onClick={() => { setType(t); setResults(null); }}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${type===t?'bg-blue-600 text-white':'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {t==='BOOK'?'📚 Books':'🎬 Movies'}
            </button>
          ))}
        </div>
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Book Name</label>
              <input className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Harry Potter" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Author Name</label>
              <input className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={author} onChange={e => setAuthor(e.target.value)} placeholder="e.g. J.K. Rowling" />
            </div>
          </div>
          <Alert type={alert.type} message={alert.msg} />
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg text-sm transition">
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </Card>
      {results && results.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Book Name','Author','Category','Serial No','Available'].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((b,i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{b.name}</td>
                  <td className="px-4 py-3 text-slate-600">{b.authorName}</td>
                  <td className="px-4 py-3 text-slate-600">{b.category}</td>
                  <td className="px-4 py-3 font-mono text-xs">{b.serialNo}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${b.status==='AVAILABLE'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>
                      {b.status==='AVAILABLE'?'Yes':'No'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
