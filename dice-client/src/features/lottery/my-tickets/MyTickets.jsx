import Pagination from "../../../components/Pagination";
import Table from "../Table";
import TopBar from "../TopBar";

function MyTickets() {
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
          {Array.from({ length: 10 }).map((_, i) => (
            <Table.Row key={i}>
              <span>mightybeast951</span>
              <span>Round 2</span>
              <span>Waiting Results</span>
              <span>Mega</span>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer>
          <Pagination count={20} />
        </Table.Footer>
      </Table>
    </div>
  );
}

export default MyTickets;
