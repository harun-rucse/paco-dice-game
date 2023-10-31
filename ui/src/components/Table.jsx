function TableHeader({ children }) {
  return (
    <div className="bg-[#3b4145] grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr] md:grid-cols-[1fr_2fr_1fr_3fr_1fr] w-full px-6 py-2 font-semibold">
      {children}
    </div>
  );
}

function TableBody({ children }) {
  return <div className="space-y-2 py-2 bg-[#5b6266]">{children}</div>;
}

function TableRow({ children }) {
  return (
    <div className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr] md:grid-cols-[1fr_2fr_1fr_3fr_1fr] text-sm font-bold px-6 md:py-1 border-b-2 border-gray-700 first:border-t-0 last:border-b-0">
      {children}
    </div>
  );
}

function TableFooter({ children }) {
  return (
    <div className="bg-[#3b4145] flex items-center justify-between px-6 py-2 footer">
      {children}
    </div>
  );
}

function Table({ children }) {
  return (
    <div role="table" className="w-full rounded-lg overflow-hidden">
      {children}
    </div>
  );
}

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Footer = TableFooter;

export default Table;
