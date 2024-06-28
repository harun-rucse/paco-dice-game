import Table from "../../components/Table";
import LoadingSpinner from "../../components/LoadingSpinner";
import Pagination from "../../components/Pagination";
import useGetFaucetTournament from "./useGetFaucetTournament";

function FaucetTable() {
  const count = 10;
  const { isLoading, data: result } = useGetFaucetTournament();

  return (
    <div>
      <Table
        columns="grid-cols-[0.8fr_1fr_0.6fr]"
        className="min-w-[30rem] tablet:min-w-[20rem] desktop:min-w-[40rem]"
      >
        <Table.Header className="text-sm tablet:text-xs laptop:text-lg bg-[#24224a] dark:bg-[#281a3b] text-[#7271bb] font-semibold dark:text-[#6d5e90] border-[#131230] dark:border-[#502f78]">
          <span>PLAYER</span>
          <span>WAGER</span>
          <span>REWARD</span>
        </Table.Header>
        <Table.Body className="max-h-[40rem] overflow-y-auto bg-[#232047] dark:bg-[#362d51]">
          {isLoading ? (
            <LoadingSpinner className="h-[34rem]" />
          ) : (
            result?.map((item, i) => (
              <Table.Row
                key={i}
                className="text-sm tablet:text-xs desktop:text-lg"
              >
                <span>{item?.account?.username}</span>
                <span className="flex items-center gap-2">
                  <img
                    src="/tokens/paco.png"
                    alt=""
                    className="w-8 tablet:w-5 desktop:w-8 h-8 tablet:h-5 desktop:h-8"
                  />
                  <span>{item?.totalWagerAmount}</span>
                </span>
                <span className="flex items-center gap-2">
                  <img
                    src="/tokens/paco.png"
                    alt=""
                    className="w-8 tablet:w-5 desktop:w-8 h-8 tablet:h-5 desktop:h-8"
                  />
                  <span>{item?.reward}</span>
                </span>
              </Table.Row>
            ))
          )}
        </Table.Body>
        <Table.Footer>
          <Pagination count={count} limit={10} />
        </Table.Footer>
      </Table>
    </div>
  );
}

export default FaucetTable;
