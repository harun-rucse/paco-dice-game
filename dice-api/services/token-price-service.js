const Web3 = require("web3");
const BTC_PRICE_FEED = process.env.BTC_PRICE_FEED;
const ETH_PRICE_FEED = process.env.ETH_PRICE_FEED;
const BNB_PRICE_FEED = process.env.BNB_PRICE_FEED;
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

// from chainlink with the pricefeed address
const getCoinPrice = async (name = "btc") => {
  const web3 = new Web3(process.env.RPC);
  try {
    if (name === "btc") {
      const priceFeed = new web3.eth.Contract(PRICE_FEED_ABI, BTC_PRICE_FEED);
      const { answer } = await priceFeed.methods.latestRoundData().call();

      return Number(answer / 10 ** 8).toFixed(3);
    } else if (name === "usdt") {
      return 1;
    } else if (name === "paco") {
      return 0;
    } else if (name === "eth") {
      const priceFeed = new web3.eth.Contract(PRICE_FEED_ABI, ETH_PRICE_FEED);
      const { answer } = await priceFeed.methods.latestRoundData().call();

      return answer / 10 ** 8;
    } else if (name === "bnb") {
      const priceFeed = new web3.eth.Contract(PRICE_FEED_ABI, BNB_PRICE_FEED);
      const { answer } = await priceFeed.methods.latestRoundData().call();

      return answer / 10 ** 8;
    }
  } catch (err) {
    console.log(err);
    throw new Error("Error of geeting token price from api");
  }
};
module.exports = getCoinPrice;
