import { useEffect, useState } from 'react';
import api from '../../../api/axios';
import PageHeader from '../../../components/PageHeader';
import Table from '../../../components/Table';

export default function ActiveIssues() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/reports/active-issues').then(r => setList(r.data.data || [])).finally(() => setLoading(false));
  }, []);
  return (
    <div>
      <PageHeader title="Active Issues" subtitle={`${list.length} currently issued`} />
      {loading ? <p className="text-slate-500 text-sm">Loading...</p> : (
        <Table headers={['Serial No','Book/Movie','Author','Member ID','Issue Date','Return By']}
          rows={list.map(i => [i.bookSerialNo, i.bookName, i.authorName, i.membershipId, i.issueDate,
            <span className={new Date(i.expectedReturnDate) < new Date() ? 'text-red-600 font-semibold' : ''}>{i.expectedReturnDate}</span>
          ])} emptyMsg="No active issues." />
      )}
    </div>
  );
}
