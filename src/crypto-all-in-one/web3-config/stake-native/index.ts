import ABI from "./abi/staking-native-abi.json";
import moment from "moment";
import { ethers } from "ethers";

let rpcLink = process.env.NEXT_PUBLIC__RPC_LINK || "https://mainnet.era.zksync.io";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC__STAKING_NATIVE;

export const getPoolInfo = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    if (!CONTRACT_ADDRESS) return {
      totalStake: 0,
      tokenPerSecond: 0,
    }
    try {
      const provider = data ? data : new ethers.providers.JsonRpcProvider(rpcLink);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      const poolInfo = await contract.getPoolInfo();

      const { totalStake, tokenPerSecond } = poolInfo;
      resolve({
        totalStake: parseInt(totalStake, 10) / 10 ** 18,
        tokenPerSecond: parseInt(tokenPerSecond, 10) / 10 ** 18,
      });
    } catch (error) {
      reject(error);
    }
  });
}

export const getStakedPersonal = async (data: any, address: string) => {
  return new Promise(async (resolve, reject) => {
    if (!CONTRACT_ADDRESS) return {
      stakedData: 0,
      date: null,
    }
    try {
      const provider = data ? data : new ethers.providers.JsonRpcProvider(rpcLink);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      const res = await contract.getUserInfo(address);
      const stakedData = parseInt(res.amount, 10) / 10 ** 18
      let date: Date | null = new Date(res.lastDepositedTime * 1000);

      if (date.getFullYear() === 1970) {
        date = null
      }

      resolve({
        stakedData,
        date: date ? moment(date).format('MM/DD/YYYY') : null
      });
    } catch (error) {
      reject(error);
    }
  });
}

export const getPendingToken = async (data: any, address: string) => {
  return new Promise(async (resolve, reject) => {
    if (!CONTRACT_ADDRESS) return null;
    try {
      const provider = data ? data : new ethers.providers.JsonRpcProvider(rpcLink);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      const parseAddress = ethers.utils.getAddress(address);
      const val = await contract.pendingToken(parseAddress)
      const pendingData = parseInt(val, 10) / 10 ** 18
      resolve(pendingData);
    } catch (error) {
      reject(error);
    }
  });
}

export const stakeTokens = async (data: any, amount: string) => {
  return new Promise(async (resolve, reject) => {
    if (!CONTRACT_ADDRESS) return null;
    try {
      if (!data) {
        reject('No data');
      }
      const option = { value: ethers.utils.parseEther(amount) };
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, data);
      const tx = await contract.deposit(option);
      resolve(tx);
    } catch (error) {
      reject(error);
    }
  });
}

export const claimTokens = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    if (!CONTRACT_ADDRESS) return null;
    try {
      if (!data) {
        reject('No data');
      }
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, data);
      const tx = await contract.withdraw('0');
      resolve(tx);
    } catch (error) {
      reject(error);
    }
  });
}

export const unstakeTokens = async (data: any, amount: string) => {
  return new Promise(async (resolve, reject) => {
    if (!CONTRACT_ADDRESS) return null;
    try {
      if (!data) {
        reject('No data');
      }
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, data);
      const tx = await contract.withdraw(ethers.utils.parseEther(amount));
      resolve(tx);
    } catch (error) {
      reject(error);
    }
  });
}