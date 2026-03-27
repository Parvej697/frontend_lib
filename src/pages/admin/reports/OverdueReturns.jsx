import { useEffect, useState } from 'react';
import api from '../../../api/axios';
import PageHeader from '../../../components/PageHeader';
import Table from '../../../components/Table';

export default function OverdueReturns() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/reports/overdue').then(r => setList(r.data.data || [])).finally(() => setLoading(false));
  }, []);
  return (
    <div>
      <PageHeader title="Overdue Returns" subtitle={`${list.length} overdue items`} />
      {loading ? <p className="text-slate-500 text-sm">Loading...</p> : (
        <Table headers={['Serial No','Book/Movie','Member ID','Issue Date','Expected Return','Fine (₹)']}
          rows={list.map(i => [i.bookSerialNo, i.bookName, i.membershipId, i.issueDate,
            <span className="text-red-600 font-semibold">{i.expectedReturnDate}</span>,
            <span className="text-red-700 font-bold">₹{i.fineCalculated ?? 0}</span>
          ])} emptyMsg="No overdue items. 🎉" />
      )}
    </div>
  );
}
