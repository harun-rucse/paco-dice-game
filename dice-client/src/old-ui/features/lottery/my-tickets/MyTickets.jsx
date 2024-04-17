import LoadingSpinner from "../../../components/LoadingSpinner";
import useGetMyTickets from "../useGetMyTickets";
import Spinner from "../../../components/Spinner";
import { numberFormat } from "../../../../utils/format";

function MyTickets() {
  const { isLoading, tickets } = useGetMyTickets();

  if (isLoading) return <LoadingSpinner className="h-[36rem]" />;

  return (
    <div className="text-white flex flex-col items-center justify-center">
      <div className="flex items-center gap-12 mb-6 mt-4">
        <img
          src="/icons/lottery_icon.png"
          alt=""
          className="w-[70px] md:w-[90px]"
        />
        <span className="uppercase md:text-xl">All Tickets</span>
        <img
          src="/icons/lottery_icon.png"
          alt=""
          className="w-[70px] md:w-[90px] rotate-[35deg]"
        />
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="text-center">
            <h4 className="uppercase md:text-lg font-normal mb-2">
              My Total active tickets
            </h4>
            <p className="text-lg">
              My Standard tickets: <span>{tickets?.active?.standard}</span>
            </p>
            <p className="text-lg">
              My Mega tickets: <span>{tickets?.active?.mega}</span>
            </p>
          </div>

          <span className="w-full h-[2px] bg-[#ba7bbd] my-4" />

          <div className="text-center">
            <h4 className="uppercase md:text-lg font-normal mb-2">
              My Total tickets of all time
            </h4>
            <p className="md:text-lg">
              Standard tickets: <span>{tickets?.allTime?.standard}</span>
            </p>
            <p className="md:text-lg">
              Mega tickets: <span>{tickets?.allTime?.mega}</span>
            </p>
          </div>

          <span className="w-full h-[2px] bg-[#ba7bbd] my-4" />

          <div className="text-center">
            <h4 className="uppercase md:text-lg font-normal mb-2">
              My Total paco spent on lottery tickets
            </h4>
            <div className="md:text-lg flex items-center justify-center gap-2">
              <span>{numberFormat(tickets?.totalPacoSpent)}</span>
              <img
                src="/tokens/paco.png"
                alt=""
                className="w-[20px] md:w-[24px]"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MyTickets;
