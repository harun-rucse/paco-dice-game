import ToggleAutoBet from "../../components/ToggleAutoBet";

function Input({ label, id, icon, ...rest }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm uppercase">
        {label}
      </label>
      <div className="flex items-center justify-between bg-[#43295c] border border-[#7f5ea0] rounded-xl px-4 py-2">
        <input
          type="number"
          id={id}
          className="bg-transparent w-full focus:outline-none text-xl text-[#aa8fc6]"
          {...rest}
        />
        {icon && <span className="text-xl text-[#a892b7]">{icon}</span>}
      </div>
    </div>
  );
}

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
  setAuto,
}) {
  return (
    <div className="px-4 py-4 space-y-3">
      <Input
        label="Number of Bet"
        id="payout"
        value={numberOfBet}
        onChange={(e) => setNumberOfBet(e.target.value)}
      />
      <Input
        label="Stop on win"
        id="stopOnWin"
        value={stopToWin}
        onChange={(e) => setStopToWin(e.target.value)}
      />
      <Input
        label="Stop on loss"
        id="stopOnLoss"
        value={stopToLoss}
        onChange={(e) => setStopToLoss(e.target.value)}
      />
      <Input
        label="Max Bet Amount"
        id="maxBetAmount"
        value={maxBetAmount}
        onChange={(e) => setMaxBetAmount(e.target.value)}
      />
      <div className="flex gap-4">
        <Input
          label="On Win-Reset"
          id="onWinReset"
          value={onWinReset}
          onChange={(e) => setOnWinReset(e.target.value)}
          icon="%"
        />
        <Input
          label="On Loss-Reset"
          id="onLossReset"
          value={onLossIncrease}
          onChange={(e) => setOnLossIncrease(e.target.value)}
          icon="%"
        />
      </div>

      <div className="flex justify-center items-center gap-4 pt-4">
        <ToggleAutoBet onSwitch={(status) => setAuto(status)} />
        <span className="uppercase text-sm">Auto Bet</span>
      </div>
    </div>
  );
}

export default AutoBet;
