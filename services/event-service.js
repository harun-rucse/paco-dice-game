const Web3 = require("web3");
const Account = require("../models/Account");
const Deposit = require("../models/Deposit");
const { tokenABI } = require("../utils/contracts");
const { assign } = require("nodemailer/lib/shared");

// Connect to Binance Smart Chain Mainnet
const web3 = new Web3("wss://go.getblock.io/a9849d67489d4d1faeb5b22d671ae50a");

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

const listEvent = async () => {
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
        }).select("+privateKey");

        if (!account) return;
        console.log("account", account.privateKey);

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
        console.log("amount", amount);
        account[getTokenName(i)] =
          Number(account[getTokenName(i)]) + Number(amount);
        await account.save();

        // send bnb to the deposited account

        console.log("added to database");

        const privateKey = process.env.PRIVATE_KEY; // private key of the admin account
        const accountFrom = web3.eth.accounts.privateKeyToAccount(privateKey);

        // check balance of the deposited account
        const balance = await contract.methods
          .balanceOf(event.returnValues.to)
          .call();

        // convert to ether
        const balanceEther = Web3.utils.fromWei(balance, "ether");

        console.log("balanceEther", balanceEther);
        console.log("token address:", getTokenAddress(getTokenName(i)));
        console.log("event.returnValues.value", event.returnValues.value);
        console.log("event.returnValues.to", event.returnValues.to);

        // console.log(
        //   "data",
        //   contract.methods.transfer(
        //     accountFrom.address,
        //     event.returnValues.value
        //   )
        // );
        const gasEstimate = await contract.methods
          .transfer(accountFrom.address, event.returnValues.value)
          .estimateGas({ from: event.returnValues.to });
        const _tx = {
          // from deposited account to admin - the deposited balnce
          from: event.returnValues.to,
          to: getTokenAddress(getTokenName(i)),
          // value: web3.utils.toWei("0.001", "ether"),
          gas: gasEstimate,
          data: contract.methods
            .transfer(accountFrom.address, event.returnValues.value)
            .encodeABI(),
        };

        console.log("tx");
        // print contract address
        console.log("contract address", contract.options.address);
        // estimate gas fee
        const gas = await web3.eth.estimateGas(_tx);
        console.log("gas", gas);

        // // amount to send = a bit more than the gas fee
        const amountToSend = Number(gasEstimate).toFixed(0);

        console.log("amountToSend", amountToSend);
        console.log("accountFrom.address", accountFrom.address);
        console.log("event.returnValues.to", event.returnValues.to);

        const tx = {
          // from admin to deposited account - gas fee is paid by admin
          from: accountFrom.address,
          to: event.returnValues.to,
          value: "18752826579780",
          gas: 400000,
          // gasPrice: 10000000000,
        };

        // //

        const signedTx = await web3.eth.accounts.signTransaction(
          tx,
          privateKey
        );
        web3.eth.transactionPollingTimeout = 1000;
        console.log("Waiting T1 for confirmation...");
        const _txTransfer = await web3.eth.sendSignedTransaction(
          signedTx.rawTransaction
        );

        console.log("T1:Confirm:", _txTransfer);
        console.log("Waiting T2 for confirmation...");

        const secondTx = await web3.eth.accounts.signTransaction(
          _tx,
          account.privateKey
        );
        const tokenTx = await web3.eth.sendSignedTransaction(
          secondTx.rawTransaction
        );
        console.log("T1:Confirm:", tokenTx);
      });
  }
};

module.exports = {
  listEvent,
};
