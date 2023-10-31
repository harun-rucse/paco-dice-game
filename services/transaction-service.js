const Web3 = require("web3");
const web3 = new Web3(
  "wss://sepolia.infura.io/ws/v3/650fe48d07f143f9b110e717c48bae4d"
);
const { tokenABI } = require("../utils/contracts");

const usdtTokenAddress = "0x95D59d33E017533b996eAf351cf7428fE7510bc0";
const btcTokenAddress = "0x1F13a6C0FF10C15919c9D2F7Cc92a6847D415658";
const pacoTokenAddress = "0x2DCd073b5888a70382fd0e48E5Af717460608728";
const ethTokenAddress = "0xd3eAB8412a184FecbA51D817fA446b9ded300c96";
const bnbTokenAddress = "0x6cf26A2ef3bBC7D3C85Bb4F81764fD682E7b99ae";

const tokensAddress = [
  usdtTokenAddress,
  btcTokenAddress,
  pacoTokenAddress,
  ethTokenAddress,
  bnbTokenAddress,
];

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
