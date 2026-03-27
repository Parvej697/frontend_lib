export default function Table({ headers, rows, emptyMsg = 'No records found.' }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {headers.map(h => (
              <th key={h} className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0
            ? <tr><td colSpan={headers.length} className="text-center py-10 text-slate-400">{emptyMsg}</td></tr>
            : rows.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-3 text-slate-700 whitespace-nowrap">{cell}</td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
