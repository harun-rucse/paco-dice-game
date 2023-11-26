import Input from "../../components/Input";

function AutoBet({
  numberOfBet,
  setNumberOfBet,
  stopToWin,
  setStopToWin,
  stopToLoss,
  setStopToLoss,
  maxBetAmount,
  setMaxBetAmount,
  onWinReset,
  setOnWinReset,
  onLossIncrease,
  setOnLossIncrease,
}) {
  return (
    <div className="gradient-infor-card-bg rounded-[29px] border-2 border-[#491b7f61] px-4 md:px-16 py-6 relative z-50 flex flex-col gap-10">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        <Input
          name="numberOfBet"
          label="Number of bet"
          value={numberOfBet}
          onChange={(e) => setNumberOfBet(e.target.value)}
        />
        <Input
          name="stopToWin"
          label="Stop On win"
          value={stopToWin}
          onChange={(e) => setStopToWin(e.target.value)}
        />
        <Input
          name="stopToLoss"
          label="Stop on loss"
          value={stopToLoss}
          onChange={(e) => setStopToLoss(e.target.value)}
        />
        <Input
          name="maxBetAmount"
          label="Max bet amount"
          value={maxBetAmount}
          onChange={(e) => setMaxBetAmount(e.target.value)}
        />
        <Input
          name="onWinReset"
          label="On win -Reset"
          value={onWinReset}
          onChange={(e) => {
            setOnWinReset(e.target.value);
            // setOnLossIncrease("");
          }}
          icon="%"
        />
        <Input
          name="onLossIncrease"
          label="On Loss -Increase"
          value={onLossIncrease}
          onChange={(e) => {
            setOnLossIncrease(e.target.value);
            // setOnWinReset("");
          }}
          icon="%"
        />
      </div>
    </div>
  );
}

export default AutoBet;
