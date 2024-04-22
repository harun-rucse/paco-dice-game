import { createContext, useContext } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { cn } from "../../../utils";

const TableContext = createContext();

function TableHeader({ children, className }) {
  const { columns } = useContext(TableContext);

  return (
    <div
      className={cn(
        `bg-[#3b4145] grid ${columns} w-full px-6 py-2 font-extralight`,
        className
      )}
    >
      {children}
    </div>
  );
}

function TableBody({ children, className }) {
  return (
    <div className={cn("space-y-2 py-2 bg-[#5b6266]", className)}>
      {children}
    </div>
  );
}

function TableRow({ children, className }) {
  const { columns } = useContext(TableContext);

  return (
    <div
      className={cn(
        `grid ${columns} text-sm font-extralight px-6 md:py-1 border-b-2 border-gray-700 first:border-t-0 last:border-b-0`,
        className
      )}
    >
      {children}
    </div>
  );
}

function TableFooter({ children, className }) {
  return (
    <div
      className={cn(
        "bg-[#3b4145] flex items-center justify-between px-6 py-2 footer",
        className
      )}
    >
      {children}
    </div>
  );
}

function Table({ columns, children }) {
  return (
    <TableContext.Provider value={{ columns }}>
      <PerfectScrollbar>
        <div
          role="table"
          className="w-full min-w-[70rem] rounded-lg overflow-x-auto"
        >
          {children}
        </div>
      </PerfectScrollbar>
    </TableContext.Provider>
  );
}

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Footer = TableFooter;

export default Table;
