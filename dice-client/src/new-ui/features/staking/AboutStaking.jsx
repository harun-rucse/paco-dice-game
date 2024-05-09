import TextBox from "./TextBox";

function AboutStaking() {
  return (
    <div className="text-white font-[Poppins] p-4 tablet:p-8 space-y-4">
      <h4 className="text-xl tablet:text-2xl text-center font-semibold">
        Paco Staking Pools
      </h4>

      <TextBox>
        <TextBox.Heading>
          Crypto Staking Pool (WBTC, ETH, WBNB, USDT):
        </TextBox.Heading>
        <TextBox.Text>
          60% of all lost bets go into the Paco staking pool.
        </TextBox.Text>
        <TextBox.Text>5% is allocated to the bonus pool.</TextBox.Text>
        <TextBox.Text>35% is designated for the team pool.</TextBox.Text>
      </TextBox>

      <TextBox>
        <TextBox.Heading>Paco Token Pool:</TextBox.Heading>
        <TextBox.Text>
          60% of all lost bets go into the Paco staking pool.
        </TextBox.Text>
        <TextBox.Text>30% is directed to the team pool.</TextBox.Text>
        <TextBox.Text>5% is allocated for bonuses.</TextBox.Text>
        <TextBox.Text>3% goes to the lottery.</TextBox.Text>
        <TextBox.Text>2% is dedicated to burning.</TextBox.Text>
      </TextBox>
    </div>
  );
}

export default AboutStaking;
