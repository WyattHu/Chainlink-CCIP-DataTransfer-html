import { ethers } from "./ethers.js";
import { contractAddress, abi } from "./constant.js";
const btn_connect = document.getElementById("btn_connect");
const btn_send = document.getElementById("btn_send");

btn_connect.onclick = connect;
btn_send.onclick = send;

async function connect() {
  if (typeof window.ethereum != "undefined") {
    console.log("Connecting to metamask...");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("Connected");
  } else {
    console.log("No metamask!!!");
  }
}

async function send() {
  if (typeof window.ethereum != "undefined") {
    console.log("Sending...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const gasLimit = 1000000;
    const transActionResponse = await contract.sendMessage(
      ethers.BigNumber.from("10344971235874465080"),
      "0xdE1f118252298C7e364143173AFB99539c4896b7",
      "Check Check Check",
      { gasLimit }
    );

    await listenForTransactionMine(transActionResponse, provider);

    console.log("Send Finished");
  } else {
    console.log("No metamask!!!");
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`);
  return new Promise((resolve, reject) => {
    try {
      provider.once(transactionResponse.hash, (transactionReceipt) => {
        console.log(
          `Completed with ${transactionReceipt.confirmations} confirmations. `
        );
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
