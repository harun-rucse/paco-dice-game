import TextBox from "./TextBox";

function FaucetRule() {
  return (
    <div className="text-white font-[Poppins] p-4 tablet:p-8 space-y-4">
      <h4 className="text-xl tablet:text-3xl text-center font-bold uppercase">
        Faucet Rules
      </h4>

      <TextBox className="space-y-10">
        <TextBox.Text>
          1-Hour Claim: Get 1 standard lottery ticket.
        </TextBox.Text>
        <TextBox.Text>
          6-Hour Claim: Get 1 standard ticket + 1 mega ticket.
        </TextBox.Text>
        <TextBox.Text>
          Other Times: No tickets for gambling or claiming the Paco bonus.
        </TextBox.Text>
      </TextBox>
    </div>
  );
}

export default FaucetRule;
