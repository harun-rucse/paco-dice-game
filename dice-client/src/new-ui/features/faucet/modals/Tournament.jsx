import TextBox from "./TextBox";

function Tournament() {
  return (
    <div className="text-white font-[Poppins] p-4 tablet:p-8 space-y-4">
      <h4 className="text-xl tablet:text-3xl text-center font-bold uppercase">
        Tournament
      </h4>

      <TextBox className="space-y-10">
        <TextBox.Text>
          - Claim or gamble to climb the ranks and win rewards.
        </TextBox.Text>
        <TextBox.Text>- All claims and gambles count as wagers.</TextBox.Text>
        <TextBox.Text>
          - The more you claim and wager, the bigger your prize.
        </TextBox.Text>
      </TextBox>
    </div>
  );
}

export default Tournament;
