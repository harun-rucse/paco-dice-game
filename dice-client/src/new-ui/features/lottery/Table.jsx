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
        `bg-[#7a3f85] text-sm tablet:text-base grid ${columns} w-full px-6 py-3 font-extralight border-b-2 border-[#582861]`,
        className
      )}
    >
      {children}
    </div>
  );
}

function TableBody({ children, className }) {
  return (
    <div className={cn("space-y-2 py-2 bg-[#794079]", className)}>
      {children}
      {children?.length === 0 && (
        <span className="block text-center text-sm py-2">No data found!</span>
      )}
    </div>
  );
}

function TableRow({ children, className }) {
  const { columns } = useContext(TableContext);

  return (
    <div
      className={cn(
        `grid ${columns} text-sm font-extralight px-6 py-2 border-b-2 border-[#582861] first:border-t-0 last:border-b-0`,
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
        "bg-[#5c378a] flex items-center justify-between px-6 py-1 footer",
        className
      )}
    >
      {children}
    </div>
  );
}

function Table({ columns, children, className }) {
  return (
    <TableContext.Provider value={{ columns }}>
      <PerfectScrollbar>
        <div
          role="table"
          className={cn(
            "w-full min-w-[30rem] rounded-lg overflow-x-auto",
            className
          )}
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
