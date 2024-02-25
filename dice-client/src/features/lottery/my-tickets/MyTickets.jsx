import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Pagination from "../../../components/Pagination";
import Table from "../Table";
import TopBar from "../TopBar";
import RoundCard from "../RoundCard";
import useGetMyTickets from "../useGetMyTickets";
import useGetLastRound from "../useGetLastRound";

function MyTickets() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLoading, tickets, count } = useGetMyTickets();
  const { isLoading: isRoundLoading, round } = useGetLastRound();

  // Set todays round and reset page
  useEffect(() => {
    if (round) {
      searchParams.set("round", round);
      searchParams.set("page", 1);

      setSearchParams(searchParams);
    }
  }, [round]);

  if (isLoading || isRoundLoading)
    return <LoadingSpinner className="h-[36rem]" />;

  return (
    <div className="text-white">
      {/* TopBar */}
      <TopBar title="My Tickets">
        <RoundCard round={round} />
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
