import { createContext, useContext } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { cn } from "../../utils";

const TableContext = createContext();

function TableHeader({ children, className }) {
  const { columns } = useContext(TableContext);

  return (
    <div
      className={cn(
        `bg-transparent text-[#b4b3b3] text-sm desktop:text-lg grid ${columns} w-full py-2 font-extralight border-b border-[#a7a5a5]`,
        className
      )}
    >
      {children}
    </div>
  );
}

function TableBody({ children, className }) {
  return (
    <div className={cn("space-y-2 py-2 bg-transparent", className)}>
      {children}
    </div>
  );
}

function TableRow({ children, className }) {
  const { columns } = useContext(TableContext);

  return (
    <div
      className={cn(
        `grid ${columns} text-sm font-extralight py-2 border-b border-[#a7a5a5] first:border-t-0 last:border-b-0`,
        className
      )}
    >
      {children}
    </div>
  );
}

function TableFooter({ children, className }) {
  return (
    <div className={cn("bg-transparent flex flex-col", className)}>
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
          className="w-full min-w-[40rem] desktop:w-full rounded-lg overflow-x-auto"
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
