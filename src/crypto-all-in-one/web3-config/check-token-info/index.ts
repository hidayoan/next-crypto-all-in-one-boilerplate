import ABI from "./abi/check-token-info.json";
import SELL_ABI from "./abi/sell-abi.json";
import { ethers } from "ethers";

let rpcLink = process.env.NEXT_PUBLIC__RPC_LINK || "https://mainnet.era.zksync.io";

const maxUInt =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935';

export const checkApprove = async (data: any, address: string, tokenAdress: string, smartcontractAdress: string, amount: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = new ethers.Contract(tokenAdress, SELL_ABI, data);
      const allowance = await contract.allowance(address, smartcontractAdress);
      //hex to number
      const number = Number(ethers.utils.formatEther(allowance));
      if (number > parseFloat(amount)) {
        resolve(true);
      }
      else {
        const aprrove = await contract.approve(smartcontractAdress, ethers.utils.parseEther(`${parseFloat(amount)}`))
        await aprrove.wait();
        resolve(true);
      }
    } catch (error) {
      reject(error);
    }
  })
}

export const checkDecimals = async (data: any, tokenAddress: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = data
        ? data
        : new ethers.providers.JsonRpcProvider(rpcLink);
      const contract = new ethers.Contract(tokenAddress, ABI, provider);
      const decimals = await contract.decimals();
      resolve(parseInt(decimals, 10));
    } catch (error) {
      reject(error);
    }
  });
}

export const checkSymbol = async (data: any, tokenAddress: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = data
        ? data
        : new ethers.providers.JsonRpcProvider(rpcLink);
      const contract = new ethers.Contract(tokenAddress, ABI, provider);
      const symbol = await contract.symbol();
      resolve(symbol);
    } catch (error) {
      reject(error);
    }
  });
}