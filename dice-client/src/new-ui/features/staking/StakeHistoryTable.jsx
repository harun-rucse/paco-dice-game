import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import Table from "../../components/Table";
import { currencyFormat, numberFormat } from "../../../utils/format";

function StakeHistoryTable() {
  const [renderItem, setRenderItem] = useState(10);

  function formatColorChangeOfLeadingZero(val) {
    const [wholePart, decimalPart] = val.split(".");

    let count = 0;
    for (let i = decimalPart.length - 1; i >= 0; i--) {
      if (decimalPart[i] == 0) {
        count++;
      } else {
        break;
      }
    }

    return (
      <span>
        {`${wholePart}.${decimalPart.slice(0, decimalPart.length - count)}`}
        <span className="text-[#69686a]">
          {decimalPart.slice(decimalPart.length - count, decimalPart.length)}
        </span>
      </span>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-6 mb-5">
        <h2 className="uppercase text-base tablet:text-2xl">Stake history</h2>
        <div className="flex items-center justify-between w-[10rem] desktop:w-[14rem] bg-[#1e1c3a] dark:bg-[#442c62] px-4 py-1 desktop:py-2 rounded-2xl">
          <FaChevronLeft className="cursor-pointer" />
          <span>1/2/2024</span>
          <FaChevronRight className="cursor-pointer" />
        </div>
      </div>
      <Table
        columns="grid-cols-[0.3fr_0.6fr_0.5fr_0.1fr] tablet:grid-cols-[1fr_2fr_1fr_0.4fr] desktop:grid-cols-[0.8fr_1fr_0.5fr_0.2fr]"
        className="min-w-[40rem] tablet:min-w-[20rem] desktop:min-w-[40rem]"
      >
        <Table.Header className="text-sm tablet:text-xs desktop:text-lg text-[#6c5b91] font-semibold dark:text-[#7968a0] border-[#131230]">
          <span>DATE</span>
          <span>STAKED PACO</span>
          <span>PAYOUTS</span>
          <span className="px-4 py-2 rounded-3xl">
            <select
              className="bg-transparent focus:outline-none cursor-pointer"
              onChange={(e) => setRenderItem(e.target.value)}
            >
              <option value="10" className="bg-[#1c1a3e]">
                10
              </option>
              <option value="20" className="bg-[#1c1a3e]">
                20
              </option>
              <option value="30" className="bg-[#1c1a3e]">
                30
              </option>
              <option value="50" className="bg-[#1c1a3e]">
                50
              </option>
            </select>
          </span>
        </Table.Header>
        <Table.Body className="max-h-[40rem] overflow-y-auto">
          {Array.from({ length: renderItem }).map((_, i) => (
            <Table.Row
              key={i}
              className="text-sm tablet:text-xs desktop:text-lg"
            >
              <span>1/1/2024</span>
              <span className="flex items-center gap-2">
                <img
                  src="/images/paco.png"
                  alt=""
                  className="w-8 tablet:w-5 desktop:w-8 h-8 tablet:h-5 desktop:h-8"
                />
                {numberFormat(260798101488)}
              </span>
              <span className="flex items-center gap-2">
                <img
                  src="/images/currency.png"
                  alt=""
                  className="w-8 tablet:w-5 desktop:w-8 h-8 tablet:h-5 desktop:h-8"
                />
                {numberFormat(10000)}$
              </span>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

export default StakeHistoryTable;
