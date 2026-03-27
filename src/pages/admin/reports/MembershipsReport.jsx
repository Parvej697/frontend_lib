import { useEffect, useState } from 'react';
import api from '../../../api/axios';
import PageHeader from '../../../components/PageHeader';
import Table from '../../../components/Table';

export default function MembershipsReport() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/reports/memberships').then(r => setList(r.data.data || [])).finally(() => setLoading(false));
  }, []);
  const sc = (s) => ({ ACTIVE:'bg-green-100 text-green-700', INACTIVE:'bg-red-100 text-red-700', CANCELLED:'bg-slate-100 text-slate-600' }[s] || '');
  return (
    <div>
      <PageHeader title="Master List of Memberships" subtitle={`${list.length} records`} />
      {loading ? <p className="text-slate-500 text-sm">Loading...</p> : (
        <Table headers={['Membership ID','Name','Contact','Address','Aadhar','Start','End','Type','Status','Fine (₹)']}
          rows={list.map(m => [m.membershipId, `${m.firstName} ${m.lastName}`, m.contactNumber, m.contactAddress||'—',
            m.aadharCardNo, m.startDate, m.endDate, m.membershipType?.replace('_',' '),
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc(m.status)}`}>{m.status}</span>,
            m.pendingFine ?? 0])} emptyMsg="No memberships found." />
      )}
    </div>
  );
}
