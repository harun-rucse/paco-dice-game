import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Table from "../Table";
import TopBar from "../TopBar";
import RoundCard from "../RoundCard";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { numberFormat } from "../../../../utils/format";
import { cn } from "../../../../utils";
import useGetMyHistories from "../useGetMyHistories";
import useGetLastRound from "../useGetLastRound";

function MyHistory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [type, setType] = useState("winning");
  const { isLoading, histories, myTotalWinnings } = useGetMyHistories(type);
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
      <div className="absolute top-20 tablet:top-4 right-12 tablet:right-8 w-[240px] tablet:w-[220px] desktop:w-[300px] text-sm desktop:text-lg text-center bg-[#53508d] dark:bg-[#753d89] border border-[#53508d] dark:border-[#955997] rounded-2xl px-8 py-1 space-y-2 tablet:space-y-0">
        <h4 className="uppercase">My total winnings</h4>
        <p className="flex items-center justify-center uppercase gap-2">
          <span>{numberFormat(myTotalWinnings)}</span>
          <img src="/tokens/paco.png" alt="" className="w-5" />
        </p>
      </div>
      {/* TopBar */}
      <TopBar
        title={type === "winning" ? "My Winnings" : "My Loosing Bets"}
        className="mt-28 tablet:mt-16"
      >
        <RoundCard round={round - 1} />

        <div className="flex items-center gap-2 mt-4 tablet:mt-0">
          <button
            className={cn(
              "text-white text-sm tablet:text-base px-3 tablet:px-6 py-1 tablet:py-2 rounded-xl shadow-xl border border-[#5b589a] dark:border-[#8e758f]",
              type === "winning"
                ? "bg-[#5b589a] dark:bg-[#915093]"
                : "bg-[#43416e] dark:bg-[#6a446b]"
            )}
            onClick={() => setType("winning")}
          >
            Winning Bets
          </button>
          <button
            className={cn(
              "text-white text-sm tablet:text-base px-3 tablet:px-6 py-1 tablet:py-2 rounded-xl shadow-xl border border-[#5b589a] dark:border-[#8e758f]",
              type === "loosing"
                ? "bg-[#5b589a] dark:bg-[#915093]"
                : "bg-[#43416e] dark:bg-[#6a446b]"
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
          columns="grid-cols-[0.5fr_0.7fr_0.4fr_0.5fr_0.5fr_0.5fr_0.1fr] tablet:grid-cols-[0.5fr_0.5fr_0.3fr_0.5fr_0.7fr_0.4fr_0.1fr]"
          className="min-w-[40rem]"
        >
          <Table.Header className="bg-[#34325c] dark:bg-[#7a3f85] border-[#34325c] dark:border-[#582861]">
            <span>Tier</span>
            <span>Prize</span>
            <span />
            <span>Round</span>
            <span>Winning Tickets</span>
            <span>Total Winnings</span>
            <span />
          </Table.Header>
          <Table.Body className="bg-[#4f4c7d] dark:bg-[#794079]">
            {histories?.map((ticket, i) => (
              <Table.Row
                key={i}
                className="border-[#4b4877] dark:border-[#582861]"
              >
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
          columns="grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_0.1fr] tablet:grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_0.1fr]"
          className="min-w-[40rem]"
        >
          <Table.Header className="bg-[#34325c] dark:bg-[#7a3f85] border-[#34325c] dark:border-[#582861]">
            <span>Ticket Type</span>
            <span>Round</span>
            <span>Number of losing tickets</span>
            <span>Total Paco Spent</span>
            <span />
          </Table.Header>
          <Table.Body className="bg-[#4f4c7d] dark:bg-[#794079]">
            {histories?.map((ticket, i) => (
              <Table.Row
                key={i}
                className="border-[#4b4877] dark:border-[#582861]"
              >
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
