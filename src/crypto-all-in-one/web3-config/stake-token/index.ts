import ABI from "./abi/staking-token-abi.json";

import { ethers } from "ethers";
import { checkApprove, checkDecimals } from "../check-token-info";
import moment from "moment";

let rpcLink = process.env.NEXT_PUBLIC__RPC_LINK || "https://mainnet.era.zksync.io";

const obj = {
  YOUR_TOKEN_NAME: process.env.NEXT_PUBLIC__STAKING_MAIN_TOKEN || '',
}

export const getPoolInfoNonNativeToken = async (data: any, name: string, tokenAddress: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const decimals: number = await checkDecimals(data, tokenAddress) as number;

      const provider = data ? data : new ethers.providers.JsonRpcProvider(rpcLink);
      const contractAddress = ethers.utils.getAddress(obj[name as keyof typeof obj]);
      const contract = new ethers.Contract(contractAddress, ABI, provider);
      const poolInfo = await contract?.getPoolInfo();

      const { totalStake, tokenPerSecond } = poolInfo;
      resolve({
        totalStake: parseFloat(totalStake.toString()) / 10 ** (decimals || 18),
        tokenPerSecond: parseFloat(tokenPerSecond.toString()) / 10 ** (decimals || 18),
      });
    } catch (error) {
      reject(error);
    }
  });
}

export const getStakedPersonalNonNativeToken = async (data: any, address: string, name: string, tokenAddress: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const decimals = await checkDecimals(data, tokenAddress) as number;
      const provider = data ? data : new ethers.providers.JsonRpcProvider(rpcLink);
      const contractAddress = ethers.utils.getAddress(obj[name as keyof typeof obj]);
      const contract = new ethers.Contract(contractAddress, ABI, provider);
      const res = await contract.getUserInfo(address);
      const stakedData = parseInt(res.amount, 10) / 10 ** (decimals || 18)
      let date: Date | null = new Date(res.lastDepositedTime * 1000);

      if (date.getFullYear() === 1970) {
        date = null
      }
      resolve({
        stakedData,
        date: date ? moment(date).format('MM/DD/YYYY') : null
      });
      resolve(stakedData);
    } catch (error) {
      reject(error);
    }
  });
}

export const getPendingNonNativeToken = async (data: any, address: string, name: string, tokenAddress: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = data ? data : new ethers.providers.JsonRpcProvider(rpcLink);
      const contractAddress = ethers.utils.getAddress(obj[name as keyof typeof obj]);
      const contract = new ethers.Contract(contractAddress, ABI, provider);
      const val = await contract.pendingToken(address)
      const pendingData = parseInt(val, 10) / 10 ** 18;
      resolve(pendingData);
    } catch (error) {
      reject(error);
    }
  });
}

export const stakeNonNativeTokens = async (data: any, amount: string, address: string, tokenAddress: string, name: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data) {
        reject('No data');
      }
      const decimals = await checkDecimals(data, tokenAddress) as number;
      const parseAmount = ethers.utils.parseUnits(amount, decimals);
      const contractAddress = ethers.utils.getAddress(obj[name as keyof typeof obj]);
      const approveData = await checkApprove(data, address, tokenAddress, contractAddress, amount);
      if (approveData) {
        const contract = new ethers.Contract(contractAddress, ABI, data);
        const tx = await contract.deposit(parseAmount);
        resolve(tx);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export const claimNonNativeTokens = async (data: any, name: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data) {
        reject('No data');
      }
      const contractAddress = ethers.utils.getAddress(obj[name as keyof typeof obj]);
      const contract = new ethers.Contract(contractAddress, ABI, data);
      const tx = await contract.withdraw('0');
      resolve(tx);
    } catch (error) {
      reject(error);
    }
  });
}

export const unstakeNonNativeTokens = async (data: any, amount: string, name: string, tokenAddress: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data) {
        reject('No data');
      }
      const decimals = await checkDecimals(data, tokenAddress);
      const contractAddress = ethers.utils.getAddress(obj[name as keyof typeof obj]);
      const contract = new ethers.Contract(contractAddress, ABI, data);
      // const parseAmount = ethers.utils.parseUnits('1', decimals);
      const tx = await contract.withdraw('1');
      resolve(tx);
    } catch (error) {
      reject(error);
    }
  });
}