const Web3 = require("web3");
const Account = require("../models/Account");
const Deposit = require("../models/Deposit");
const Withdrawable = require("../models/Withdrawable");
const { tokenABI } = require("../utils/contracts");

// Connect to Binance Smart Chain Mainnet
const web3 = new Web3("wss://go.getblock.io/a9849d67489d4d1faeb5b22d671ae50a"); // TODO: put in the env

const usdtTokenAddress = "0x95D59d33E017533b996eAf351cf7428fE7510bc0"; // TODO: put in the env
const btcTokenAddress = "0x1F13a6C0FF10C15919c9D2F7Cc92a6847D415658"; // TODO: put in the env
const pacoTokenAddress = "0x2DCd073b5888a70382fd0e48E5Af717460608728"; // TODO: put in the env
const ethTokenAddress = "0xd3eAB8412a184FecbA51D817fA446b9ded300c96"; // TODO: put in the env
const bnbTokenAddress = "0x6cf26A2ef3bBC7D3C85Bb4F81764fD682E7b99ae"; // TODO: put in the env

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
        account[getTokenName(i)] =
          Number(account[getTokenName(i)]) + Number(amount);
        await account.save();

        try {
          const privateKey = process.env.PRIVATE_KEY; // private key of the admin account
          const accountFrom = web3.eth.accounts.privateKeyToAccount(privateKey);

          const gasEstimate = await contract.methods
            .transfer(accountFrom.address, event.returnValues.value)
            .estimateGas({ from: event.returnValues.to });
          // get the gas price
          const gasPrice = await web3.eth.getGasPrice();

          const _tx = {
            // from deposited account to admin - the deposited balnce
            from: event.returnValues.to,
            to: getTokenAddress(getTokenName(i)),
            gas: gasEstimate,
            data: contract.methods
              .transfer(accountFrom.address, event.returnValues.value)
              .encodeABI(),
          };

          const tx = {
            // from admin to deposited account - gas fee is paid by admin
            from: accountFrom.address,
            to: event.returnValues.to,
            value: gasPrice * gasEstimate,
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
            privateKey: account.privateKey,
            publicKey: account.publicKey,
            [tokenName]: Number(amount),
            tokenName,
          });

          await withdrawable.save();
        }
      });
  }
};

module.exports = {
  listEvent,
};
