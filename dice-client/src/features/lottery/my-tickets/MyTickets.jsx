import Pagination from "../../../components/Pagination";
import Table from "../Table";
import TopBar from "../TopBar";
import useGetMyTickets from "../useGetMyTickets";

function MyTickets() {
  const { isLoading, tickets, count } = useGetMyTickets();

  return (
    <div className="text-white">
      {/* TopBar */}
      <TopBar title="My Tickets">
        <div className="bg-[#7c4b7d] text-sm md:text-base px-4 md:px-6 py-2 rounded-lg shadow-lg">
          Round: 2
        </div>
        <div className="hidden md:block" />
      </TopBar>

      <div className="lottery-divider my-4" />

      {/* My tickets Table */}
      <Table columns="grid-cols-[1fr_1fr_1fr_0.5fr]">
        <Table.Header>
          <span>Username</span>
          <span>Round</span>
          <span>Status</span>
          <span>Ticket Type</span>
        </Table.Header>
        <Table.Body>
          {tickets?.map((ticket, i) => (
            <Table.Row key={i}>
              <span>{ticket.username}</span>
              <span>{ticket.round}</span>
              <span>{ticket.status}</span>
              <span>{ticket.type}</span>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </div>
  );
}

export default MyTickets;
