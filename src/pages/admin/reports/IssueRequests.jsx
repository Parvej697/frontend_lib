import { useEffect, useState } from 'react';
import api from '../../../api/axios';
import PageHeader from '../../../components/PageHeader';
import Table from '../../../components/Table';

export default function IssueRequests() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/reports/issue-requests').then(r => setList(r.data.data || [])).finally(() => setLoading(false));
  }, []);
  const sc = (s) => s==='PENDING_FINE'?'bg-red-100 text-red-700':'bg-yellow-100 text-yellow-700';
  return (
    <div>
      <PageHeader title="Issue Requests / Pending Returns" subtitle={`${list.length} pending`} />
      {loading ? <p className="text-slate-500 text-sm">Loading...</p> : (
        <Table headers={['Serial No','Book','Member ID','Issue Date','Expected Return','Status','Fine (₹)']}
          rows={list.map(i => [i.bookSerialNo, i.bookName, i.membershipId, i.issueDate, i.expectedReturnDate,
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc(i.status)}`}>{i.status}</span>,
            i.fineCalculated ?? 0
          ])} emptyMsg="No pending requests." />
      )}
    </div>
  );
}
