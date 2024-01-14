const Web3 = require("web3");
const Account = require("../models/Account");
const Deposit = require("../models/Deposit");
const Withdrawable = require("../models/Withdrawable");
const { tokenABI } = require("../utils/contracts");
const decimal = require("../utils/decimal");

const listeners = [];

const subscriptionIds = [];

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

function getTokenNameByAddress(address) {
  switch (address) {
    case usdtTokenAddress:
      return "usdt";
    case btcTokenAddress:
      return "btc";
    case pacoTokenAddress:
      return "paco";
    case ethTokenAddress:
      return "eth";
    case bnbTokenAddress:
      return "bnb";
  }
}

const setListener = async (i, web3) => {
  const contract = new web3.eth.Contract(tokenABI, tokensAddress[i]);
  // console.log(await contract.methods.name().call());

  // Subscribe to Transfer events
  const _listener = contract.events
    .Transfer({
      fromBlock: "latest",
    })
    .on("data", async (event) => {
      // console.log("event:", event);
      // console.log(
      //   "value:",
      //   getTokenName(event.address),
      //   event.returnValues.value
      // );

      // finding the account with the public key to identify the user
      const account = await Account.findOne({
        publicKey: event.returnValues.to,
      }).select("+privateKey");

      if (!account) return; // if the account is not found, return
      console.log(
        "value:",
        getTokenNameByAddress(event.address),
        event.returnValues.value
      );
      const amount = Web3.utils.fromWei(event.returnValues.value, "ether"); // convert the value to ether

      // save the deposit to the database
      const newDeposit = new Deposit({
        account: account._id,
        amount,
        trxId: event.transactionHash,
        tokenName: getTokenName(i),
        status: "success",
      });
      await newDeposit.save();
      // update account balance
      // account[getTokenName(i)] =
      //   Number(account[getTokenName(i)]) + Number(amount);

      // update account balance
      account[getTokenName(i)] = decimal.addition(
        account[getTokenName(i)],
        amount
      );
      await account.save();
      try {
        const privateKey = process.env.PRIVATE_KEY; // private key of the admin account
        // console.log("privateKey:", privateKey);
        // console.log("privateKey:", privateKey.length);
        const accountFrom = web3.eth.accounts.privateKeyToAccount(privateKey);

        // get the gas estimate of the transfer transaction
        const gasEstimate = await contract.methods
          .transfer(accountFrom.address, event.returnValues.value)
          .estimateGas({ from: event.returnValues.to }); // estimate gas of the transfer

        // get the gas price
        const gasPrice = await web3.eth.getGasPrice();

        // create the transaction object of the transfer
        const _tx = {
          // from deposited account to admin - the deposited balnce
          from: event.returnValues.to,
          to: getTokenAddress(getTokenName(i)),
          gas: gasEstimate,
          data: contract.methods
            .transfer(process.env.HOLDER_PUBLIC_KEY, event.returnValues.value)
            .encodeABI(),
        };

        // create the transaction object of the gas fee transfer from the admin wallet to the deposited account
        const tx = {
          // from admin to deposited account - gas fee is paid by admin
          from: accountFrom.address,
          to: event.returnValues.to,
          value: gasPrice * gasEstimate,
        };
        // sign the transaction
        web3.eth.estimateGas(tx).then(async (_gasEstimate) => {
          const _trx = {
            from: accountFrom.address,
            to: event.returnValues.to,
            value: gasPrice * gasEstimate,
            gas: _gasEstimate,
          };
          web3.eth.transactionPollingTimeout = 1000;
          const signedTx = await web3.eth.accounts.signTransaction(
            _trx,
            privateKey
          );
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
        });
      } catch (err) {
        console.log("Transfer err:", err);
        const tokenName = getTokenName(i);
        const withdrawable = new Withdrawable({
          account: account._id,
          amount,
          tokenName,
        });
        await withdrawable.save();
      }
    })
    .on("connected", function (subscriptionId) {
      // subscriptionIds.push(subscriptionId);
      console.log("connected:", subscriptionId);
    })
    .on("changed", (event) => {
      // remove event from local database
      console.log(
        "changed:-------------------------------------------",
        getTokenNameByAddress(event.address)
      );

      // print the subscription id.
    })
    .on("error", console.error);
  return _listener;
};

const listEvent = async (web3) => {
  for (let i = 0; i < tokensAddress.length; i++) {
    // Subscribe to Transfer events
    const _listener = await setListener(i, web3);

    listeners.push(_listener);
  }
  // don't need to unsubscribe

  // const _timer = setInterval(async () => {
  //   for (let i = 0; i < listeners.length; i++) {
  //     listeners[i].unsubscribe(async function (error, success) {
  //       if (success) {
  //         // console.log("Successfully unsubscribed!");
  //         listeners[i] = await setListener(i, web3);
  //       }
  //     });
  //     // check if unscribed or not
  //   }
  // }, 1000 * 60);
};

module.exports = {
  listEvent,
};
