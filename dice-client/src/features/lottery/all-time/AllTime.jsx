import Table from "../Table";
import TopBar from "../TopBar";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { numberFormat } from "../../../utils/format";
import useGetAllTime from "../useGetAllTime";

function AllBets() {
  const { isLoading, allTime, stats } = useGetAllTime();

  if (isLoading) return <LoadingSpinner className="h-[36rem]" />;

  return (
    <div className="text-white">
      <div className="flex flex-col md:flex-row mb-6 md:mb-0 md:justify-end gap-6 md:gap-10">
        <div className="md:self-end text-sm md:text-lg text-center bg-[#753d89] border border-[#955997] rounded-2xl px-8 py-2">
          <h4 className="uppercase">Total Tickets Purchased</h4>
          <p className="flex items-center text-left uppercase gap-2">
            <span className="w-[130px] md:w-[180px]">Standard tickets</span>
            <div className="flex items-center gap-2 text-left">
              <img src="/icons/minor-jackpot.png" alt="" className="w-8" />
              <span>{numberFormat(stats.totalStandardTicket)}</span>
            </div>
          </p>
          <p className="flex items-center text-left uppercase gap-2">
            <span className="w-[130px] md:w-[180px]">Mega tickets</span>
            <div className="flex items-center gap-2 text-left">
              <img src="/icons/ticket.png" alt="" className="w-8" />
              <span>{numberFormat(stats.totalMegaTicket)}</span>
            </div>
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm md:text-lg text-center bg-[#753d89] border border-[#955997] rounded-2xl px-8 py-2 space-y-2 md:space-y-0">
            <h4 className="uppercase">Total Paco won from lottery tickets</h4>
            <p className="flex items-center justify-center uppercase gap-2">
              <span>{numberFormat(stats.totalPacoWon)}</span>
              <img src="/tokens/paco.png" alt="" className="w-5" />
            </p>
          </div>

          <div className="text-sm md:text-lg text-center bg-[#753d89] border border-[#955997] rounded-2xl px-8 py-2 space-y-2 md:space-y-0">
            <h4 className="uppercase">Total Paco spent on lottery tickets</h4>
            <p className="flex items-center justify-center uppercase gap-2">
              <span>{numberFormat(stats.totalPacoSpent)}</span>
              <img src="/tokens/paco.png" alt="" className="w-5" />
            </p>
          </div>
        </div>
      </div>
      <TopBar title="Total Tickets Of All Time">
        <div />
      </TopBar>

      <div className="lottery-divider my-4" />

      <Table
        columns="grid-cols-[0.5fr_0.7fr_0.5fr_0.5fr_0.5fr_0.1fr] md:grid-cols-[0.5fr_0.4fr_0.3fr_0.5fr_0.3fr_0.1fr]"
        className="min-w-[40rem]"
      >
        <Table.Header>
          <span>Tier</span>
          <span>Prize</span>
          <span />
          <span>Total Tickets</span>
          <span>Total Winnings</span>
          <span />
        </Table.Header>
        <Table.Body>
          {allTime?.map((ticket, i) => (
            <Table.Row key={i}>
              <span>{ticket.tier}</span>
              <span>{i <= 10 ? numberFormat(ticket.prize) : ticket.prize}</span>
              <img src="/tokens/paco.png" alt="" className="w-6" />
              <span>{numberFormat(ticket.totalTickets)}</span>
              <span>{numberFormat(ticket.totalWinnings)}</span>
              <img src="/tokens/paco.png" alt="" className="w-6" />
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

export default AllBets;
