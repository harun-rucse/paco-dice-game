import TextBox from "./TextBox";

function FaucetGamble() {
  return (
    <div className="text-white font-[Poppins] p-4 tablet:p-8 space-y-4">
      <h4 className="text-xl tablet:text-3xl text-center font-bold uppercase">
        Faucet Gamble
      </h4>

      <TextBox>
        <TextBox.Text>
          Instead of claiming your Paco bonus, try doubling your rewards up to
          20 times with a max multiplier of 1,048,576x. Each level has 5 stages.
          Complete all 4 levels to win the Jackpot.
        </TextBox.Text>
        <div className="pt-8">
          <TextBox.Text>-Win chance: 50%</TextBox.Text>
          <TextBox.Text>-House edge: 0%</TextBox.Text>
          <TextBox.Text>-Max payout: 2,097,152,000 PACO</TextBox.Text>
        </div>
      </TextBox>
    </div>
  );
}

export default FaucetGamble;
