import Table from "../../components/TableClient";

const data = [
  {
    icon: "/tokens/paco.png",
    daily: 1288434.45204184,
    monthly: 1288434.45204184,
    perQuarter: 1288434.45204184,
    perYear: 1288434.45204184,
  },
  {
    icon: "/tokens/btc.png",
    daily: 1288434.45204184,
    monthly: 1288434.45204184,
    perQuarter: 1288434.45204184,
    perYear: 1288434.45204184,
  },
  {
    icon: "/tokens/eth.png",
    daily: 1288434.45204184,
    monthly: 1288434.45204184,
    perQuarter: 1288434.45204184,
    perYear: 1288434.45204184,
  },
  {
    icon: "/tokens/bnb.png",
    daily: 1288434.45204184,
    monthly: 1288434.45204184,
    perQuarter: 1288434.45204184,
    perYear: 1288434.45204184,
  },
  {
    icon: "/tokens/usdt.png",
    daily: 1288434.45204184,
    monthly: 1288434.45204184,
    perQuarter: 1288434.45204184,
    perYear: 1288434.45204184,
  },
];

function SelectButton({ handleOnClick, children }) {
  return (
    <button
      className="text-sm lg:text-lg px-1 lg:px-8 py-1 rounded-lg transition hover:bg-[#66478e]"
      onClick={handleOnClick}
    >
      {children}
    </button>
  );
}

function StakingCalculator() {
  return (
    <div className="text-white p-4 lg:p-8 space-y-4">
      <h4 className="text-2xl font-[Poppins]">Staking Calculator</h4>
      <p className="text-sm font-[Poppins]">
        Calculate the potential earnings from your staked $PACO tokens! Simply
        input the quantity in the field to view estimated payouts in each
        cryptocurrencies over different timeframes. The greater the number of
        tokens you stake, the greater your potential profit.
      </p>

      <div className="bg-[#1e132d] border p-1 border-[#A856E9] rounded-lg flex items-center justify-between">
        <SelectButton>1M</SelectButton>
        <SelectButton>10M</SelectButton>
        <SelectButton>100M</SelectButton>
        <SelectButton>1B</SelectButton>
        <SelectButton>10B</SelectButton>
        <SelectButton>My Balance</SelectButton>
      </div>

      <div className="space-y-2 pt-4 lg:pt-8">
        <span className="text-[#b4b3b3] text-xl">$1,100.20</span>
        <div className="bg-[#1e132d] border px-6 py-2 border-[#A856E9] rounded-lg flex items-center gap-12">
          <img src="/tokens/paco.png" alt="" className="object-contain w-8" />
          <input
            type="text"
            className="text-lg bg-transparent w-full focus:outline-none "
            value="10000000000"
          />
        </div>
      </div>

      <Table columns="grid-cols-[1fr_1fr_1fr_1fr]">
        <Table.Header>
          <span>Daily</span>
          <span>Monthly</span>
          <span>Per quarter</span>
          <span>Per year</span>
        </Table.Header>
        <Table.Body>
          {data?.map((row, i) => (
            <Table.Row key={i}>
              <div className="flex items-start gap-2">
                <img
                  src={row.icon}
                  alt=""
                  className="h-6 lg:h-8 object-contain -mt-1"
                />
                <span>{row.daily}</span>
              </div>
              <span>{row.monthly}</span>
              <span>{row.perQuarter}</span>
              <span>{row.perYear}</span>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer className="pt-2">
          <div className="flex items-center gap-2 border-b pb-2 mx-1">
            <img
              src="/icons/currency-icon.png"
              alt=""
              className="h-6 lg:h-8 object-contain"
            />
            <span className="text-[#b4b3b3] uppercase">TOTAL IN USD</span>
          </div>
          <Table.Row className="px-6">
            <span>1288434.45204184</span>
            <span>1288434.45204184</span>
            <span>1288434.45204184</span>
            <span>1288434.45204184</span>
          </Table.Row>
        </Table.Footer>
      </Table>
    </div>
  );
}

export default StakingCalculator;
