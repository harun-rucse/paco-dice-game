const Web3 = require("web3");
const Account = require("../models/Account");
const Deposit = require("../models/Deposit");
const { tokenABI } = require("../utils/contracts");

// Connect to Binance Smart Chain Mainnet
const web3 = new Web3(
  "wss://sepolia.infura.io/ws/v3/650fe48d07f143f9b110e717c48bae4d"
);

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

function getTokenName(val) {
  switch (val) {
    case 0:
      return "usdt";
    case 1:
      return "btc";
    case 2:
      return "paco";
    case 3:
      return "eth";
    case 4:
      return "bnb";
  }
}

const listEvent = () => {
  for (let i = 0; i < tokensAddress.length; i++) {
    const contract = new web3.eth.Contract(tokenABI, tokensAddress[i]);

    // Subscribe to Transfer events
    contract.events
      .Transfer({
        fromBlock: "latest",
      })
      .on("data", async (event) => {
        //event.transactionHash, event.returnValues.to, event.returnValues.value
        console.log("publicKey", event.returnValues.to);

        const account = await Account.findOne({
          publicKey: event.returnValues.to,
        });

        if (!account) return;

        const amount = Web3.utils.fromWei(event.returnValues.value, "ether");
        const newDeposit = new Deposit({
          account: account._id,
          amount,
          trxId: event.transactionHash,
          tokenName: getTokenName(i),
          status: "success",
        });

        await newDeposit.save();
        // update account balance
        account[getTokenName(i)] =
          Number(account[getTokenName(i)]) + Number(amount);
        await account.save();
      });
  }
};

module.exports = {
  listEvent,
};
