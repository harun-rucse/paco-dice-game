import { useState } from "react";
import Table from "../components/Table";

function Homepage() {
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
    <div className="pb-40 desktop:px-10">
      <div className="h-[10rem] tablet:h-[16rem] desktop:h-[30rem]">
        <img
          src="/images/banner.jpeg"
          alt=""
          className="w-full h-full object-fill"
        />
      </div>

      <div className="pt-8 tablet:pt-10 desktop:pt-20 pb-10 px-4 desktop:px-0">
        <h2 className="uppercase text-lg tablet:text-2xl">Featured</h2>
        <div className="mt-4 tablet:mt-6">
          <img
            src="/images/lottery-banner.jpeg"
            alt=""
            className="overflow-hidden h-[5rem] tablet:h-full object-contain rounded-xl tablet:rounded-2xl"
          />
          <div className="flex gap-2 tablet:gap-6 desktop:gap-8 tablet:mt-6 desktop:mt-8">
            <img
              src="/images/dice.jpeg"
              alt=""
              className="overflow-hidden h-[4rem] tablet:h-[8rem] desktop:h-[16rem] object-contain rounded-lg tablet:rounded-2xl"
            />
            <img
              src="/images/staking.jpeg"
              alt=""
              className="overflow-hidden h-[4rem] tablet:h-[8rem] desktop:h-[16rem] object-contain rounded-lg tablet:rounded-2xl"
            />
          </div>
        </div>
      </div>

      <div className="pb-10 tablet:pb-10 desktop:pb-20 px-4 desktop:px-0">
        <h2 className="uppercase text-lg tablet:text-2xl mb-5">Bet history</h2>
        <Table
          columns="grid-cols-[0.4fr_0.5fr_0.8fr_1fr_0.8fr_1fr_0.2fr] tablet:grid-cols-[0.3fr_0.6fr_1fr_1fr_0.9fr_1fr_0.5fr] desktop:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_0.3fr]"
          className="min-w-[58rem] tablet:min-w-[20rem] desktop:min-w-[40rem]"
        >
          <Table.Header className="bg-[#24224a] dark:bg-[#161619] text-sm tablet:text-xs desktop:text-lg text-[#6c5b91] font-semibold dark:text-[#7968a0] border-[#605e96]">
            <span>GAME</span>
            <span>TIME</span>
            <span>USER</span>
            <span>BET AMOUNT</span>
            <span>MULTIPLAYER</span>
            <span>PAYOUT</span>
            <span className="bg-[#1c1a3e] dark:bg-[#212026] px-4 py-2 rounded-3xl">
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
          <Table.Body className="bg-[#24224a] dark:bg-[#16151a] max-h-[40rem] overflow-y-auto">
            {Array.from({ length: renderItem }).map((_, i) => (
              <Table.Row
                key={i}
                className="text-sm tablet:text-xs desktop:text-lg"
              >
                <span>Dice</span>
                <span>11:21:32 PM</span>
                <span className="flex items-center gap-2">
                  <div className="bg-[#d11f9f] w-8 tablet:w-6 desktop:w-8 h-8 tablet:h-6 desktop:h-8 rounded-full flex justify-center items-center">
                    <img
                      src="/images/user.png"
                      alt=""
                      className="w-6 tablet:w-4 desktop:w-6 h-6 tablet:h-4 desktop:h-6 object-contain"
                    />
                  </div>
                  <span>MightyBeast</span>
                </span>
                <span className="flex items-center gap-2">
                  <img
                    src="/images/paco.png"
                    alt=""
                    className="w-8 tablet:w-5 desktop:w-8 h-8 tablet:h-5 desktop:h-8"
                  />
                  {formatColorChangeOfLeadingZero("258451.95400000")}
                </span>
                <span className="bg-[#353436] w-min h-min px-3 py-1 rounded-2xl text-[#12e50d]">
                  x10.8889X
                </span>
                <span className="flex items-center gap-2">
                  <img
                    src="/images/paco.png"
                    alt=""
                    className="w-8 tablet:w-5 desktop:w-8 h-8 tablet:h-5 desktop:h-8"
                  />
                  {formatColorChangeOfLeadingZero("258451.95400000")}
                </span>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <div className="pb-0 tablet:pb-16 desktop:pb-28 flex flex-col desktop:flex-row items-center justify-center gap-4 desktop:gap-16">
        <h2 className="uppercase text-[#6d5e90] text-lg desktop:text-xl">
          Accepted Currencies
        </h2>
        <div className="flex items-center gap-12 desktop:gap-16">
          <img src="/images/btc.png" alt="" className="w-10" />
          <img src="/images/bnb.png" alt="" className="w-10" />
          <img src="/images/eth.png" alt="" className="w-8" />
          <img src="/images/usdt.png" alt="" className="w-10" />
        </div>
      </div>
    </div>
  );
}

export default Homepage;
