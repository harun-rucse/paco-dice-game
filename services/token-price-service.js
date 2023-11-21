const Web3 = require("web3");
const BTC_PRICE_FEED = "0x264990fbd0A4796A3E3d8E37C4d5F87a3aCa5Ebf";
const ETH_PRICE_FEED = "0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e";
const BNB_PRICE_FEED = "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE";
const PRICE_FEED_ABI = [
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "description",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
    name: "getRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];
const web3 = new Web3("wss://go.getblock.io/ea110be7d253459ab72dca48b7f80d9a");
// from chainlink with the pricefeed address
const getCoinPrice = async (name = "btc") => {
  if (name === "btc") {
    const priceFeed = new web3.eth.Contract(PRICE_FEED_ABI, BTC_PRICE_FEED);
    const { answer } = await priceFeed.methods.latestRoundData().call();
    console.log(answer / 10 ** 8);
    return Number(answer / 10 ** 8).toFixed(3);
  } else if (name === "usdt") {
    return 1;
  } else if (name === "paco") {
    return 0;
  } else if (name === "eth") {
    const priceFeed = new web3.eth.Contract(PRICE_FEED_ABI, ETH_PRICE_FEED);
    const { answer } = await priceFeed.methods.latestRoundData().call();
    console.log(answer / 10 ** 8);
    return answer / 10 ** 8;
  } else if (name === "bnb") {
    const priceFeed = new web3.eth.Contract(PRICE_FEED_ABI, BNB_PRICE_FEED);
    const { answer } = await priceFeed.methods.latestRoundData().call();
    console.log(answer / 10 ** 8);
    return answer / 10 ** 8;
  }
};
module.exports = getCoinPrice;
