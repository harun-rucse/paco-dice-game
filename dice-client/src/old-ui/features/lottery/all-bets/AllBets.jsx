import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Table from "../Table";
import TopBar from "../TopBar";
import RoundCard from "../RoundCard";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { numberFormat } from "../../../../utils/format";
import useGetAllBets from "../useGetAllBets";
import useGetLastRound from "../useGetLastRound";

function AllBets() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLoading, allBets } = useGetAllBets();
  const { isLoading: isRoundLoading, round } = useGetLastRound();

  // Set todays round and reset page
  useEffect(() => {
    if (round) {
      searchParams.set("round", round - 1);

      setSearchParams(searchParams);
    }
  }, [round]);

  if (isLoading || isRoundLoading)
    return <LoadingSpinner className="h-[36rem]" />;

  return (
    <div className="text-white">
      {/* TopBar */}
      <TopBar title="All Bets">
        <RoundCard round={round - 1} />
        <div />
      </TopBar>

      <div className="lottery-divider my-4" />

      {/*All bets Table */}
      <Table
        columns="grid-cols-[0.5fr_0.7fr_0.4fr_0.5fr_0.5fr_0.5fr_0.1fr] md:grid-cols-[0.5fr_0.5fr_0.3fr_0.5fr_0.7fr_0.4fr_0.1fr]"
        className="min-w-[40rem]"
      >
        <Table.Header>
          <span>Tier</span>
          <span>Prize</span>
          <span />
          <span>Round</span>
          <span>Tickets</span>
          <span>Total Winnings</span>
          <span />
        </Table.Header>
        <Table.Body>
          {allBets?.map((ticket, i) => (
            <Table.Row key={i}>
              <span>{ticket.tier}</span>
              <span>{i <= 10 ? numberFormat(ticket.prize) : ticket.prize}</span>
              <img src="/tokens/paco.png" alt="" className="w-6" />
              <span>{ticket.round}</span>
              <span>
                {ticket.winningTickets === "-"
                  ? "-"
                  : numberFormat(ticket.winningTickets)}
              </span>
              <span>
                {ticket.totalWinnings === "-"
                  ? "-"
                  : numberFormat(ticket.totalWinnings)}
              </span>
              <img src="/tokens/paco.png" alt="" className="w-6" />
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

export default AllBets;
