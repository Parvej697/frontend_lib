import { useState, useEffect } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/PageHeader';
import Table from '../../components/Table';

const REPORTS = [
  { key:'books',        label:'Master List of Books',   endpoint:'/reports/books' },
  { key:'movies',       label:'Master List of Movies',  endpoint:'/reports/movies' },
  { key:'memberships',  label:'Memberships',            endpoint:'/reports/memberships' },
  { key:'active',       label:'Active Issues',          endpoint:'/reports/active-issues' },
  { key:'overdue',      label:'Overdue Returns',        endpoint:'/reports/overdue' },
  { key:'requests',     label:'Issue Requests',         endpoint:'/reports/issue-requests' },
];

export default function UserReports() {
  const [active, setActive] = useState('books');
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const rpt = REPORTS.find(r => r.key === active);
    setLoading(true);
    api.get(rpt.endpoint).then(r => setData(r.data.data || [])).finally(() => setLoading(false));
  }, [active]);

  const getHeaders = () => {
    switch(active) {
      case 'books':  return ['Serial No','Name','Author','Category','Status','Cost'];
      case 'movies': return ['Serial No','Name','Director','Category','Status','Cost'];
      case 'memberships': return ['Membership ID','Name','Contact','Start','End','Status'];
      case 'active': return ['Serial No','Book','Member ID','Issue Date','Return By'];
      case 'overdue': return ['Serial No','Book','Member ID','Expected Return','Fine (₹)'];
      case 'requests': return ['Serial No','Book','Member ID','Status'];
      default: return [];
    }
  };

  const getRows = () => {
    switch(active) {
      case 'books': case 'movies': return data.map(b=>[b.serialNo,b.name,b.authorName,b.category,b.status,b.cost]);
      case 'memberships': return data.map(m=>[m.membershipId,`${m.firstName} ${m.lastName}`,m.contactNumber,m.startDate,m.endDate,m.status]);
      case 'active': return data.map(i=>[i.bookSerialNo,i.bookName,i.membershipId,i.issueDate,i.expectedReturnDate]);
      case 'overdue': return data.map(i=>[i.bookSerialNo,i.bookName,i.membershipId,i.expectedReturnDate,`₹${i.fineCalculated||0}`]);
      case 'requests': return data.map(i=>[i.bookSerialNo,i.bookName,i.membershipId,i.status]);
      default: return [];
    }
  };

  return (
    <div>
      <PageHeader title="Reports" />
      <div className="flex flex-wrap gap-2 mb-5">
        {REPORTS.map(r => (
          <button key={r.key} onClick={() => setActive(r.key)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${active===r.key?'bg-blue-600 text-white':'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'}`}>
            {r.label}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-xl p-1">
        {loading ? <p className="text-slate-500 text-sm p-4">Loading...</p>
          : <Table headers={getHeaders()} rows={getRows()} emptyMsg="No data." />}
      </div>
    </div>
  );
}
