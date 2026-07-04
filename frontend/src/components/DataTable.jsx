export default function DataTable({ columns, rows, emptyMessage = 'No records found' }) {
  if (!rows?.length) {
    return (
      <div className="card py-12 text-center text-sm text-secondary">{emptyMessage}</div>
    );
  }

  return (
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-background/60">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-medium text-secondary">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.id || idx} className="border-b border-border/70 last:border-0">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
