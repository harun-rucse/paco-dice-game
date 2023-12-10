import InputBox from "./InputBox";

function Fairness() {
  function handleCheck() {
    console.log("Check!");
  }

  return (
    <div className="w-full gradient-fairness-modal-bg h-full md:min-h-[36rem] border border-[#C094F9] rounded-2xl">
      <div className="flex flex-col text-white px-4 md:px-10 py-6 space-y-4 md:space-y-6 font-['Poppins']">
        <div className="space-y-3">
          <h4 className="uppercase text-xl md:text-2xl font-bold">Fairness</h4>
          <p className="text-xs md:text-base">
            The system is built on the SHA256 algorithm and ensures provable
            fairness. It incorporates a random number, formed by combining a
            randomly generated winning number with the server's initial number.
            Each round is characterized by its unique hash, comprising randomly
            generated wins specific to each bet.
          </p>
        </div>

        <InputBox
          type="string"
          name="hash-round"
          label="Hash round"
          value="82487fdb1927a60cdcc16046f9e0bfa757298ff98f2ef1963162955aef34445c"
          onChange={() => {}}
          readOnly
        />

        <div className="space-y-4 md:space-y-6 md:pt-4">
          <h4 className="md:text-xl font-semibold">Previous rounds history</h4>
          <div className="flex items-center gap-4">
            <select className="w-full bg-[#7226d3] p-3 rounded-lg focus:outline-none font-semibold border-r-[12px] border-r-[transparent] cursor-pointer">
              <option value="dice">Dice</option>
            </select>
            <select className="w-full bg-[#7226d3] p-3 rounded-lg focus:outline-none font-semibold border-r-[12px] border-r-[transparent] cursor-pointer">
              <option value="">11/28/23, 11:20:05pm</option>
            </select>
          </div>
        </div>

        <InputBox
          type="string"
          name="random-seed"
          label="Random Seed"
          value="79_cPAtbPlLVTUaYk"
          onChange={() => {}}
          readOnly
        />

        <InputBox
          type="string"
          name="hash-round"
          label="Hash round"
          value="82487fdb1927a60cdcc16046f9e0bfa757298ff98f2ef1963162955aef34445c"
          onChange={() => {}}
          readOnly
        />

        <button
          className="self-center bg-[#34a446] border-b-[6px] border-[#214F30] px-12 py-3 rounded-lg font-semibold"
          onClick={handleCheck}
        >
          Check
        </button>
      </div>
    </div>
  );
}

export default Fairness;
