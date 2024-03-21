import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Table from "../Table";
import TopBar from "../TopBar";
import RoundCard from "../RoundCard";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { numberFormat } from "../../../utils/format";
import { cn } from "../../../utils";
import useGetMyHistories from "../useGetMyHistories";
import useGetLastRound from "../useGetLastRound";

function MyHistory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [type, setType] = useState("winning");
  const { isLoading, histories } = useGetMyHistories(type);
  const { isLoading: isRoundLoading, round } = useGetLastRound();

  // Set todays round
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
      <TopBar title={type === "winning" ? "My Winnings" : "My Loosing Bets"}>
        <RoundCard round={round - 1} />

        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <button
            className={cn(
              "text-white text-sm md:text-base px-3 md:px-6 py-1 md:py-2 rounded-xl shadow-xl border border-[#8e758f]",
              type === "winning" ? "bg-[#915093]" : "bg-[#6a446b]"
            )}
            onClick={() => setType("winning")}
          >
            Winning Bets
          </button>
          <button
            className={cn(
              "text-white text-sm md:text-base px-3 md:px-6 py-1 md:py-2 rounded-xl shadow-xl border border-[#8e758f]",
              type === "loosing" ? "bg-[#915093]" : "bg-[#6a446b]"
            )}
            onClick={() => setType("loosing")}
          >
            Loosing Bets
          </button>
        </div>
      </TopBar>

      <div className="lottery-divider my-4" />

      {/* My winnings Table */}
      {type === "winning" && (
        <Table
          columns="grid-cols-[0.5fr_0.7fr_0.4fr_0.5fr_0.5fr_0.5fr_0.1fr] md:grid-cols-[0.5fr_0.5fr_0.3fr_0.5fr_0.7fr_0.4fr_0.1fr]"
          className="min-w-[40rem]"
        >
          <Table.Header>
            <span>Tier</span>
            <span>Prize</span>
            <span />
            <span>Round</span>
            <span>Winning Tickets</span>
            <span>Total Winnings</span>
            <span />
          </Table.Header>
          <Table.Body>
            {histories?.map((ticket, i) => (
              <Table.Row key={i}>
                <span>{ticket.tier}</span>
                <span>
                  {i < 10 ? numberFormat(ticket.prize) : ticket.prize}
                </span>
                <img src="/tokens/paco.png" alt="" className="w-6" />
                <span>{ticket.round}</span>
                <span>{numberFormat(ticket.winningTickets)}</span>
                <span>{numberFormat(ticket.totalWinnings)}</span>
                <img src="/tokens/paco.png" alt="" className="w-6" />
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      {/* My loosing Table */}
      {type === "loosing" && (
        <Table
          columns="grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_0.1fr] md:grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_0.1fr]"
          className="min-w-[40rem]"
        >
          <Table.Header>
            <span>Ticket Type</span>
            <span>Round</span>
            <span>Number of losing tickets</span>
            <span>Total Paco Spent</span>
            <span />
          </Table.Header>
          <Table.Body>
            {histories?.map((ticket, i) => (
              <Table.Row key={i}>
                <span>{ticket.ticketType}</span>
                <span>{ticket.round}</span>
                <span>{numberFormat(ticket.loosingTickets)}</span>
                <span>{numberFormat(ticket.totalPacoSpent)}</span>
                <img src="/tokens/paco.png" alt="" className="w-6" />
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  );
}

export default MyHistory;
