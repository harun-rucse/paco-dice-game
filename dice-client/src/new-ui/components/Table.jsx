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
        `bg-[#1e1c3a] dark:bg-[#161619] grid ${columns} items-center w-full px-6 py-3 text-[#7968a0] font-semibold border-b-2 border-[#131230] dark:border-[#121115]`,
        className
      )}
    >
      {children}
    </div>
  );
}

function TableBody({ children, className }) {
  return (
    <div
      className={cn("space-y-1 py-2 bg-[#232047] dark:bg-[#16151a]", className)}
    >
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
        `grid ${columns} text-lg font-extralight px-6 py-2`,
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
            "w-full min-w-[30rem] rounded-xl overflow-x-auto border border-[#39376b] dark:border-[#28272b]",
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

export default Table;
