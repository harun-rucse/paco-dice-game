import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import Pagination from "../../../components/Pagination";
import Table from "../Table";
import TopBar from "../TopBar";

function AllBets() {
  function handleChangeRound(direction) {
    console.log(direction);
  }

  return (
    <div className="text-white">
      {/* TopBar */}
      <TopBar title="My Winnings">
        <div className="text-center space-y-1">
          <span className="text-lg">Round</span>
          <div className="flex items-center gap-1">
            <FaChevronLeft
              size={26}
              color="#9760b1"
              className="shadow-xl cursor-pointer"
              onClick={() => handleChangeRound("left")}
            />
            <div className="bg-[#7c4b7d] text-sm md:text-base px-4 py-2 rounded-lg shadow-lg">
              #000000001
            </div>
            <FaChevronRight
              size={26}
              color="#9760b1"
              className="shadow-xl cursor-pointer"
              onClick={() => handleChangeRound("right")}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <button className="bg-[#6a446b] text-white text-sm md:text-base px-3 md:px-6 py-1 md:py-2 rounded-xl shadow-xl border border-[#8e758f]">
            All
          </button>
          <button className="bg-[#6a446b] text-white text-sm md:text-base px-3 md:px-6 py-1 md:py-2 rounded-xl shadow-xl border border-[#8e758f]">
            Losing Bets
          </button>
          <button className="bg-[#915093] text-white text-sm md:text-base px-3 md:px-6 py-1 md:py-2 rounded-xl shadow-xl border border-[#8e758f]">
            Winning Bets
          </button>
        </div>
      </TopBar>

      <div className="lottery-divider my-4" />

      {/* My winnings Table */}
      <Table
        columns="grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_0.1fr] md:grid-cols-[1fr_1fr_1fr_0.5fr_0.1fr]"
        className="min-w-[40rem]"
      >
        <Table.Header>
          <span>Username</span>
          <span>Ticket Type</span>
          <span>Winning Tier</span>
          <span>Prize</span>
          <span />
        </Table.Header>
        <Table.Body>
          {Array.from({ length: 10 }).map((_, i) => (
            <Table.Row key={i}>
              <span>mightybeast951</span>
              <span>Mega</span>
              <span>Minor Jackpot</span>
              <span>1,058,515,990</span>
              <img src="/tokens/paco.png" alt="" className="w-6" />
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

export default AllBets;
