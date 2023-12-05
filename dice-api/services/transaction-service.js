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
  return new Web3(process.env.RPC);
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

async function withdrawableTransfer(
  tokenName,
  senderAddress,
  receivedAddress,
  amountToSend,
  privateKey
) {
  const web3 = getWeb3(); // get the web3 instance with get the block
  const contract = new web3.eth.Contract(tokenABI, getTokenAddress(tokenName)); // instance of the contract.

  const gasEstimate = await contract.methods
    .transfer(
      receivedAddress,
      Web3.utils.toWei(amountToSend.toString(), "ether")
    )
    .estimateGas({ from: senderAddress }); // estimating the gas of the transfer function call.
  console.log("gasEstimate", gasEstimate);

  // eth balance of the account with web3
  const ethBalance = await web3.eth.getBalance(senderAddress); // get the eth balace of the user account
  const gasPrice = await web3.eth.getGasPrice(); // price of the each gas

  // convert gasEstimate * gasPrice to ether value
  const gasFee = web3.utils.fromWei(
    (gasEstimate * gasPrice).toString(),
    "ether"
  ); // total gas cost in eth

  const adminAccount = web3.eth.accounts.privateKeyToAccount(
    process.env.PRIVATE_KEY
  ); // get the admin wallet.

  //convert ethBalance to ether value
  const ethBalanceInEther = web3.utils.fromWei(ethBalance, "ether");
  if (ethBalanceInEther < gasFee) {
    console.log("Sending fee.....");

    const tx = {
      // from admin to deposited account - gas fee is paid by admin
      from: adminAccount.address,
      to: senderAddress,
      value: Web3.utils.toWei(
        Number(gasFee - ethBalanceInEther)
          .toFixed(0)
          .toString(),
        "ether"
      ),
    };

    web3.eth.estimateGas(tx).then(async (estimatesGas) => {
      const _tx = {
        // from admin to deposited account - gas fee is paid by admin
        from: adminAccount.address,
        to: senderAddress,
        value: Web3.utils.toWei(
          ((gasFee - ethBalanceInEther) * 10).toString(),
          "ether"
        ),
        gas: estimatesGas,
      };
      const signedTx = await web3.eth.accounts.signTransaction(
        _tx,
        process.env.PRIVATE_KEY
      );
      web3.eth.transactionPollingTimeout = 1000;
      console.log("Waiting T1 for confirmation...");
      const _txTransfer = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );
      console.log("T1 confirmed");

      const tx = {
        gas: gasEstimate,
        to: getTokenAddress(tokenName),
        data: contract.methods
          .transfer(
            receivedAddress,
            Web3.utils.toWei(amountToSend.toString(), "ether")
          )
          .encodeABI(),
      };

      return new Promise((resolve, reject) => {
        console.log("Waiting T2 for confirmation...");
        web3.eth.accounts
          .signTransaction(tx, privateKey)
          .then((signedTx) =>
            web3.eth.sendSignedTransaction(signedTx.rawTransaction)
          )
          .then((receipt) => {
            console.log("T2 confirmed");
            resolve(receipt);
          })
          .catch((err) => {
            console.error(err);
            reject(err);
          });
      });
    });
  } else {
    const tx = {
      gas: gasEstimate,
      to: getTokenAddress(tokenName),
      data: contract.methods
        .transfer(
          receivedAddress,
          Web3.utils.toWei(amountToSend.toString(), "ether")
        )
        .encodeABI(),
    };

    return new Promise((resolve, reject) => {
      console.log("Waiting T2 for confirmation...");
      web3.eth.accounts
        .signTransaction(tx, privateKey)
        .then((signedTx) =>
          web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        )
        .then((receipt) => {
          console.log("T2 confirmed");
          resolve(receipt);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
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

module.exports = { transfer, withdrawableTransfer };
