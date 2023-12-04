const Web3 = require("web3");
const Account = require("../models/Account");
const Deposit = require("../models/Deposit");
const Withdrawable = require("../models/Withdrawable");
const { tokenABI } = require("../utils/contracts");

const listeners = [];

const subscriptionIds = [];

const web3 = new Web3(process.env.RPC);

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

const setListener = async (i) => {
  const contract = new web3.eth.Contract(tokenABI, tokensAddress[i]);
  console.log(await contract.methods.name().call());

  // Subscribe to Transfer events
  const _listener = contract.events
    .Transfer({
      fromBlock: "latest",
    })
    .on("data", async (event) => {
      // console.log("value:", event.address, event.returnValues.value);
      // if paco token show a message

      if (
        event.address.toLowerCase() === pacoTokenAddress.toLowerCase() &&
        event.returnValues.value > 0
      ) {
        console.log("paco token transfered");
      }

      const account = await Account.findOne({
        publicKey: event.returnValues.to,
      }).select("+privateKey");
      // console.log("account", account);
      if (!account) return;
      const amount = Number(
        Web3.utils.fromWei(event.returnValues.value, "ether")
      );
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

      try {
        // throw new Error("test");

        const privateKey = process.env.PRIVATE_KEY; // private key of the admin account
        const accountFrom = web3.eth.accounts.privateKeyToAccount(privateKey);

        const gasEstimate = await contract.methods
          .transfer(accountFrom.address, event.returnValues.value)
          .estimateGas({ from: event.returnValues.to });
        console.log("gasEstimate", gasEstimate);
        // get the gas price
        const gasPrice = await web3.eth.getGasPrice();

        const _tx = {
          // from deposited account to admin - the deposited balnce
          from: event.returnValues.to,
          to: getTokenAddress(getTokenName(i)),
          gas: 400000,
          data: contract.methods
            .transfer(process.env.HOLDER_PUBLIC_KEY, event.returnValues.value)
            .encodeABI(),
        };

        const tx = {
          // from admin to deposited account - gas fee is paid by admin
          from: accountFrom.address,
          to: event.returnValues.to,
          value: gasPrice * 400000,
          gas: 400000,
          // gasPrice: 10000000000,
        };

        const signedTx = await web3.eth.accounts.signTransaction(
          tx,
          privateKey
        );
        web3.eth.transactionPollingTimeout = 1000;
        console.log("Waiting T1 for confirmation...");
        const _txTransfer = await web3.eth.sendSignedTransaction(
          signedTx.rawTransaction
        );

        console.log("T1:Confirmed");
        console.log("Waiting T2 for confirmation...");

        const secondTx = await web3.eth.accounts.signTransaction(
          _tx,
          account.privateKey
        );
        const tokenTx = await web3.eth.sendSignedTransaction(
          secondTx.rawTransaction
        );
        console.log("T2:Confirmed");
      } catch (err) {
        console.log("Transfer err:", err);

        const tokenName = getTokenName(i);
        const withdrawable = new Withdrawable({
          account: account._id,
          amount: Number(amount),
          tokenName,
        });

        await withdrawable.save();
      }
    });
  return _listener;
};

const listEvent = async () => {
  console.log("listEvent");
  for (let i = 0; i < tokensAddress.length; i++) {
    // Subscribe to Transfer events
    const _listener = await setListener(i);

    listeners.push(_listener);
  }

  const _timer = setInterval(async () => {
    for (let i = 0; i < listeners.length; i++) {
      listeners[i].unsubscribe(async function (error, success) {
        if (success) {
          console.log("Successfully unsubscribed!");
          listeners[i] = await setListener(i);
        }
      });
      // check if unscribed or not
    }
  }, 1000 * 60);
};

module.exports = {
  listEvent,
};
