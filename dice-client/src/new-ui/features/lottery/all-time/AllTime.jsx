import Table from "../Table";
import TopBar from "../TopBar";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { numberFormat } from "../../../../utils/format";
import useGetAllTime from "../useGetAllTime";

function AllBets() {
  const { isLoading, allTime, stats } = useGetAllTime();

  if (isLoading) return <LoadingSpinner className="h-[36rem]" />;

  return (
    <div className="text-white">
      <div className="flex flex-col tablet:flex-row mb-6 tablet:mb-0 tablet:justify-end gap-6 tablet:gap-10">
        <div className="tablet:self-end text-sm tablet:text-base desktop:text-lg text-center bg-[#53508d] dark:bg-[#753d89] border border-[#53508d] dark:border-[#955997] rounded-2xl px-8 py-2">
          <h4 className="uppercase">Total Tickets Purchased</h4>
          <p className="flex text-sm desktop:text-base items-center text-left uppercase gap-2">
            <span className="w-[130px] tablet:w-[180px]">Standard tickets</span>
            <div className="flex items-center gap-2 text-left">
              <img src="/icons/minor-jackpot.png" alt="" className="w-8" />
              <span>{numberFormat(stats.totalStandardTicket)}</span>
            </div>
          </p>
          <p className="flex text-sm desktop:text-base items-center text-left uppercase gap-2">
            <span className="w-[130px] tablet:w-[180px]">Mega tickets</span>
            <div className="flex items-center gap-2 text-left">
              <img src="/icons/ticket.png" alt="" className="w-8" />
              <span>{numberFormat(stats.totalMegaTicket)}</span>
            </div>
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm desktop:text-lg text-center bg-[#53508d] dark:bg-[#753d89] border border-[#53508d] dark:border-[#955997] rounded-2xl px-8 py-2 space-y-2 tablet:space-y-0">
            <h4 className="uppercase">Total Paco won from lottery tickets</h4>
            <p className="flex items-center justify-center uppercase gap-2">
              <span>{numberFormat(stats.totalPacoWon)}</span>
              <img src="/tokens/paco.png" alt="" className="w-5" />
            </p>
          </div>

          <div className="text-sm desktop:text-lg text-center bg-[#53508d] dark:bg-[#753d89] border border-[#53508d] dark:border-[#955997] rounded-2xl px-8 py-2 space-y-2 tablet:space-y-0">
            <h4 className="uppercase">Total Paco spent on lottery tickets</h4>
            <p className="flex items-center justify-center uppercase gap-2">
              <span>{numberFormat(stats.totalPacoSpent)}</span>
              <img src="/tokens/paco.png" alt="" className="w-5" />
            </p>
          </div>
        </div>
      </div>
      <TopBar title="Total Tickets Of All Time" className="mt-8 desktop:mt-0">
        <div />
      </TopBar>

      <div className="lottery-divider my-4" />

      <Table
        columns="grid-cols-[0.5fr_0.7fr_0.5fr_0.5fr_0.5fr_0.1fr] tablet:grid-cols-[0.5fr_0.4fr_0.3fr_0.5fr_0.3fr_0.1fr]"
        className="min-w-[40rem]"
      >
        <Table.Header className="bg-[#34325c] dark:bg-[#7a3f85] border-[#34325c] dark:border-[#582861]">
          <span>Tier</span>
          <span>Prize</span>
          <span />
          <span>Total Tickets</span>
          <span>Total Winnings</span>
          <span />
        </Table.Header>
        <Table.Body className="bg-[#4f4c7d] dark:bg-[#794079]">
          {allTime?.map((ticket, i) => (
            <Table.Row
              key={i}
              className="border-[#4b4877] dark:border-[#582861]"
            >
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
