const Web3 = require("web3");
const { tokenABI } = require("../utils/contracts");

const usdtTokenAddress = process.env.USDT_TOKEN_ADDRESS;
const btcTokenAddress = process.env.BTC_TOKEN_ADDRESS;
const pacoTokenAddress = process.env.PACO_TOKEN_ADDRESS;
const ethTokenAddress = process.env.ETH_TOKEN_ADDRESS;
const bnbTokenAddress = process.env.BNB_TOKEN_ADDRESS;

const tokensAddress = [
  usdtTokenAddress,
  btcTokenAddress,
  pacoTokenAddress,
  ethTokenAddress,
  bnbTokenAddress,
];
const getWeb3 = () => {
  return new Web3(
    "wss://sepolia.infura.io/ws/v3/760e934f6b0541519abd83bd611acbfd"
  );
};

function getTokenAddress(tokenName) {
  switch (tokenName) {
    case "usdt":
      return tokensAddress[0];
    case "btc":
      return tokensAddress[1];
    case "paco":
      return tokensAddress[2];
    case "eth":
      return tokensAddress[3];
    case "bnb":
      return tokensAddress[4];
  }
}

async function transfer(tokenName, receiverAddress, amountToSend) {
  const web3 = getWeb3();
  const contract = new web3.eth.Contract(tokenABI, getTokenAddress(tokenName));

  const tx = {
    gas: 400000,
    to: getTokenAddress(tokenName),
    data: contract.methods
      .transfer(
        receiverAddress,
        Web3.utils.toWei(amountToSend.toString(), "ether")
      )
      .encodeABI(),
  };

  return new Promise((resolve, reject) => {
    web3.eth.accounts
      .signTransaction(tx, process.env.PRIVATE_KEY)
      .then((signedTx) =>
        web3.eth.sendSignedTransaction(signedTx.rawTransaction)
      )
      .then((receipt) => {
        resolve(receipt);
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
}

module.exports = { transfer };
