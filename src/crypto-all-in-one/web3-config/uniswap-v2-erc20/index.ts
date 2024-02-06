import abiJson from "./abi/UniswapV2ERC20.json";

import { ethers } from "ethers";
import { checkApprove, checkDecimals } from "../check-token-info";

const maxUInt =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935';

let rpcLink = process.env.NEXT_PUBLIC__RPC_LINK || "https://rpc.xdaichain.com/";

export const balanceOfPair = async (data: any, token: string, address: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = data
        ? data
        : new ethers.providers.JsonRpcProvider(rpcLink);
      const contract = new ethers.Contract(token, abiJson, provider);
      const decimals = await checkDecimals(data, token) as number;
      const balance = await contract.balanceOf(address);
      resolve(parseInt(balance, 10) / 10 ** decimals);
    } catch (error) {
      reject(error);
    }
  });
}

export const totalSupplyOfPair = async (data: any, token: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = data
        ? data
        : new ethers.providers.JsonRpcProvider(rpcLink);
      const contract = new ethers.Contract(token, abiJson, provider);
      const decimals = await checkDecimals(data, token) as number;
      const supply = await contract.totalSupply();
      resolve(parseInt(supply, 10) / 10 ** decimals);
    } catch (error) {
      reject(error);
    }
  });
}

export const checkApproveUniswapV2ERC20 = async (data: any, address: string, tokenAdress: string, smartcontractAdress: string, amount: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = data
        ? data
        : new ethers.providers.JsonRpcProvider(rpcLink);
      const contract = new ethers.Contract(tokenAdress, abiJson, provider);
      const allowance = await contract.allowance(address, smartcontractAdress);

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