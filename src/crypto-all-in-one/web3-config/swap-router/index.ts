import router from "./abi/router.json";
import factory from "./abi/factory.json";
import wnative from "./abi/w_native.json";

import { ethers } from "ethers";
import { checkApprove, checkDecimals, checkSymbol } from "../check-token-info";
import { checkApproveUniswapV2ERC20 } from "../uniswap-v2-erc20";
import { PairDataChildType } from "@/helpers/type";

let rpcLink = process.env.NEXT_PUBLIC__RPC_LINK || "https://rpc.xdaichain.com/";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC__ROUTER_SWAP as string;
const FACTORY_ADDRESS = process.env.NEXT_PUBLIC__FACTORY_SWAP as string;

export const getAmountOut = async (data: any, amount: string, tokenIn: string, tokenOut: string) => {
  return new Promise(async (resolve, reject) => {
    if (amount === "") resolve({
      amountOut: 0,
      impact: 0
    });
    if (tokenIn === tokenOut) resolve({
      amountOut: amount,
      impact: 0
    });
    try {
      const provider = data
        ? data
        : new ethers.providers.JsonRpcProvider(rpcLink);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, router, provider);
      const decimalsIn = await checkDecimals(data, tokenIn) as number;
      const amountIn = ethers.utils.parseUnits(amount, decimalsIn);
      const decimalsOut = await checkDecimals(data, tokenOut) as number;
      const amountOut = await contract.getAmountsOut(amountIn, [tokenIn, tokenOut]);

      // caculate impact

      if (amountOut && amountOut.length == 2) {
        const pairData: PairDataChildType[] = await getPairData(data, await gerPair(data, tokenIn, tokenOut) as string) as PairDataChildType[]
        const reserveOut = pairData.find((item) => item.address?.toLowerCase() === tokenOut?.toLowerCase())?.reserveEthers || '0'
        const reserveIn = pairData.find((item) => item.address?.toLowerCase() === tokenIn?.toLowerCase())?.reserveEthers || '0'

        const priceBefore = (parseInt(reserveOut, 10) / 10 ** decimalsOut) / (parseInt(reserveIn, 10) / 10 ** decimalsIn);
        const priceAfter = ((parseInt(reserveOut, 10) / 10 ** decimalsOut) - (parseInt(amountOut[1], 10) / 10 ** decimalsOut)) / ((parseInt(reserveIn, 10) / 10 ** decimalsIn) + (parseInt(`${amountIn}`, 10) / 10 ** decimalsIn));
        resolve({
          amountOut: parseInt(amountOut[1], 10) / 10 ** decimalsOut,
          impact: (priceBefore - priceAfter) / priceBefore * 100
        });
      }
      resolve({
        amountOut: amount,
        impact: 0
      })
    } catch (error) {
      reject(error);
    }
  });
}

export const getAmountIn = async (data: any, amount: string, tokenIn: string, tokenOut: string) => {
  return new Promise(async (resolve, reject) => {
    if (amount === "") resolve({
      amountIn: 0,
      impact: 0
    });
    if (tokenIn === tokenOut) resolve({
      amountIn: amount,
      impact: 0
    });
    try {
      const provider = data
        ? data
        : new ethers.providers.JsonRpcProvider(rpcLink);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, router, provider);

      const decimalsOut = await checkDecimals(data, tokenOut) as number;
      const amountOut = ethers.utils.parseUnits(amount, decimalsOut);

      const decimalsIn = await checkDecimals(data, tokenIn) as number;
      const amountIn = await contract.getAmountsIn(amountOut, [tokenIn, tokenOut]);

      // caculate impact

      if (amountIn && amountIn.length == 2) {
        const pairData: PairDataChildType[] = await getPairData(data, await gerPair(data, tokenIn, tokenOut) as string) as PairDataChildType[]
        const reserveOut = pairData.find((item) => item.address?.toLowerCase() === tokenOut?.toLowerCase())?.reserveEthers || '0'
        const reserveIn = pairData.find((item) => item.address?.toLowerCase() === tokenIn?.toLowerCase())?.reserveEthers || '0'

        const priceBefore = (parseInt(reserveOut, 10) / 10 ** decimalsOut) / (parseInt(reserveIn, 10) / 10 ** decimalsIn);
        const priceAfter = ((parseInt(reserveOut, 10) / 10 ** decimalsOut) - (parseInt(`${amountOut}`, 10) / 10 ** decimalsOut)) / ((parseInt(reserveIn, 10) / 10 ** decimalsIn) + (parseInt(amountIn[0], 10) / 10 ** decimalsIn));

        resolve({
          amountIn: parseInt(amountIn[0], 10) / 10 ** decimalsIn,
          impact: (priceBefore - priceAfter) / priceBefore * 100
        });
      }
      resolve({
        amountIn: amount,
        impact: 0
      })
    } catch (error) {
      reject(error);
    }
  });
}

export const swapExactTokensForTokens = async (data: any, amount: string, slippageTolerance = 0.5, time: number, tokenIn: string, tokenOut: string, address: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = data
        ? data
        : new ethers.providers.JsonRpcProvider(rpcLink);

      const decimalsIn = await checkDecimals(provider, tokenIn) as number;
      const approveData = await checkApprove(provider, address, tokenIn, CONTRACT_ADDRESS, amount);
      if (approveData) {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, router, provider);
        const amountIn = ethers.utils.parseUnits(amount, decimalsIn);
        const amounts = await contract.getAmountsOut(amountIn, [tokenIn, tokenOut]);
        const amountOut = amounts[1];
        const amountOutMin = amountOut.mul(100 - slippageTolerance * 100).div(100);

        const tx = await contract.swapExactTokensForTokensSupportingFeeOnTransferTokens(
          amountIn,
          amountOutMin,
          [tokenIn, tokenOut],
          address,
          Date.now() + 1000 * 60 * time,
          // [false]
        );
        resolve(tx);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export const swapExactTokensForETH = async (data: any, amount: string, slippageTolerance = 0.5, time: number, tokenIn: string, address: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = data
        ? data
        : new ethers.providers.JsonRpcProvider(rpcLink);

      const decimalsIn = await checkDecimals(provider, tokenIn) as number;
      const amountIn = ethers.utils.parseUnits(amount, decimalsIn);
      const approveData = await checkApprove(provider, address, tokenIn, CONTRACT_ADDRESS, amount);
      if (approveData) {
        const ethAddress = process.env.NEXT_PUBLIC__WRAP_NATIVE_ADDRESS || "";
        const contract = new ethers.Contract(CONTRACT_ADDRESS, router, provider);
        const amounts = await contract.getAmountsOut(amountIn, [tokenIn, ethAddress]);
        const amountOut = amounts[1];
        const amountOutMin = amountOut.mul(100 - slippageTolerance * 100).div(100);
        console.log(amountOutMin);
        const tx = await contract.swapExactTokensForETHSupportingFeeOnTransferTokens(
          amountIn,
          amountOutMin,
          [tokenIn, ethAddress],
          address,
          Date.now() + 1000 * 60 * time,
        );
        resolve(tx);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export const swapExactETHForTokens = async (data: any, amount: string, slippageTolerance = 0.5, time: number, tokenOut: string, address: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = data
        ? data
        : new ethers.providers.JsonRpcProvider(rpcLink);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, router, provider);
      const decimalsOut = await checkDecimals(provider, tokenOut);

      const ethAddress = process.env.NEXT_PUBLIC__WRAP_NATIVE_ADDRESS || "";

      const amounts = await contract.getAmountsOut(ethers.utils.parseEther(amount), [ethAddress, tokenOut]);
      const amountOut = amounts[1];
      const amountOutMin = amountOut?.mul(100 - slippageTolerance * 100).div(100);
      const tx = await contract.swapExactETHForTokens(
        amountOutMin,
        [ethAddress, tokenOut],
        address,
        Date.now() + 1000 * 60 * time,
        // [false],
        { value: ethers.utils.parseEther(amount) }
      );
      resolve(tx);
    } catch (error) {
      reject(error);
    }
  });
}

export const addLiquidity = async (data: any, tokenA: string, tokenB: string, amountA: string, amountB: string, slippageTolerance = 0.5, time: number, to: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = data
        ? data
        : new ethers.providers.JsonRpcProvider(rpcLink);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, router, provider);
      const decimalsA = await checkDecimals(provider, tokenA) as number;
      const decimalsB = await checkDecimals(provider, tokenB) as number;
      const amountAIn = ethers.utils.parseUnits(amountA, decimalsA);
      const amountBIn = ethers.utils.parseUnits(amountB, decimalsB);

      const approveDataA = tokenA === process.env.NEXT_PUBLIC__WRAP_NATIVE_ADDRESS || await checkApprove(provider, to, tokenA, CONTRACT_ADDRESS, amountA);
      const approveDataB = tokenB === process.env.NEXT_PUBLIC__WRAP_NATIVE_ADDRESS || await checkApprove(provider, to, tokenB, CONTRACT_ADDRESS, amountB);

      const isAasNative = tokenA === process.env.NEXT_PUBLIC__WRAP_NATIVE_ADDRESS;
      const isBasNative = tokenB === process.env.NEXT_PUBLIC__WRAP_NATIVE_ADDRESS;

      const amountAMin = amountAIn.mul(100 - slippageTolerance * 100).div(100);
      const amountBMin = amountBIn.mul(100 - slippageTolerance * 100).div(100);

      if (approveDataA && approveDataB) {
        if (isAasNative) {
          const tx = await contract.addLiquidityETH(
            tokenB,
            amountBIn,
            amountBMin,
            amountAMin,
            to,
            Date.now() + 1000 * 60 * time,
            // [false]
            { value: ethers.utils.parseEther(amountA) }
          );
          resolve(tx);
        } else if (isBasNative) {
          const tx = await contract.addLiquidityETH(
            tokenA,
            amountAIn,
            amountAMin,
            amountBMin,
            to,
            Date.now() + 1000 * 60 * time,
            // [false]
            { value: ethers.utils.parseEther(amountB) }
          );
          resolve(tx);
        }
        else {
          const tx = await contract.addLiquidity(
            tokenA,
            tokenB,
            amountAIn,
            amountBIn,
            amountAMin,
            amountBMin,
            to,
            Date.now() + 1000 * 60 * time,
            // [false]
          );
          resolve(tx);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
}


export const getAllPairs = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = data
        ? data
        : new ethers.providers.JsonRpcProvider(rpcLink);
      const contract = new ethers.Contract(FACTORY_ADDRESS, factory, provider);
      const allPairsLength = await contract.allPairsLength();
      const pairs = [];
      for (let i = 0; i < allPairsLength; i++) {
        const pair = await contract.allPairs(i);
        pairs.push(pair);
      }
      resolve(pairs);
    } catch (error) {
      reject(error);
    }
  });
}

export const getAllPairsData = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = data
        ? data
        : new ethers.providers.JsonRpcProvider(rpcLink);
      const contract = new ethers.Contract(FACTORY_ADDRESS, factory, provider);
      const res = await contract.getAllPairsData();

      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
}

export const getPairData = async (data: any, pairAdress: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = data
        ? data
        : new ethers.providers.JsonRpcProvider(rpcLink);
      const contract = new ethers.Contract(FACTORY_ADDRESS, factory, provider);
      const res = await contract.getPairData(pairAdress);
      const { token0, token1, reverse0, reverse1 } = res;
      const decimals0 = await checkDecimals(provider, token0) as number;
      const decimals1 = await checkDecimals(provider, token1) as number;

      const token0Symbol = await checkSymbol(provider, token0);
      const token1Symbol = await checkSymbol(provider, token1);

      resolve([
        {
          address: token0,
          reserve: parseInt(reverse0, 10) / 10 ** decimals0,
          symbol: token0Symbol,
          reserveEthers: reverse0
        },
        {
          address: token1,
          reserve: parseInt(reverse1, 10) / 10 ** decimals1,
          symbol: token1Symbol,
          reserveEthers: reverse1
        }
      ]);
    } catch (error) {
      reject(error);
    }
  });
}

export const gerPair = async (data: any, tokenA: string, tokenB: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = data
        ? data
        : new ethers.providers.JsonRpcProvider(rpcLink);
      const contract = new ethers.Contract(FACTORY_ADDRESS, factory, provider);
      const pair = await contract.getPair(tokenA, tokenB);
      resolve(pair);
    } catch (error) {
      reject(error);
    }
  });
}

export const quote = async (data: any, amountA: string, reserveA: string, reserveB: string) => {
  return new Promise(async (resolve, reject) => {
    if (amountA === "") resolve(0);
    if (isNaN(parseInt(amountA))) resolve(0);
    try {
      const provider = data
        ? data
        : new ethers.providers.JsonRpcProvider(rpcLink);

      const contract = new ethers.Contract(CONTRACT_ADDRESS, router, provider);
      const amountB = await contract.quote(ethers.utils.parseEther(amountA), ethers.utils.parseEther(reserveA), ethers.utils.parseEther(reserveB));

      resolve(parseInt(amountB, 10) / 10 ** 18)
      // resolve(amountB);
    } catch (error) {
      reject(error);
    }
  });
}


export const removeLiquidity = async (data: any, tokenA: string, tokenB: string, liquidity: string, amountAMin: string, amountBMin: string, to: string, tokenLiq: string, navite = '') => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = data
        ? data
        : new ethers.providers.JsonRpcProvider(rpcLink);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, router, provider);
      const amountIn = ethers.utils.parseUnits(liquidity, 18);
      const approve = await checkApproveUniswapV2ERC20(provider, to, tokenLiq, CONTRACT_ADDRESS, liquidity);

      const isAasNative = navite === 'tokenA'
      const isBasNative = navite === 'tokenB'

      if (approve) {
        if (isAasNative) {
          const tx = await contract.removeLiquidityETH(
            tokenB,
            amountIn,
            amountBMin,
            amountAMin,
            to,
            Date.now() + 1000 * 60 * 2,
            // [false]
          );
          resolve(tx);
        } else if (isBasNative) {
          const tx = await contract.removeLiquidityETH(
            tokenA,
            amountIn,
            amountAMin,
            amountBMin,
            to,
            Date.now() + 1000 * 60 * 2,
            // [false]
            {
              gasLimit: 100000,
              gasPrice: 100
            }
          );
          resolve(tx);
        }
        else {
          const tx = await contract.removeLiquidity(
            tokenA,
            tokenB,
            amountIn,
            amountAMin,
            amountBMin,
            to,
            Date.now() + 1000 * 60 * 2,
            // [false]
          );
          resolve(tx);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
}

export const depositWNative = async (data: any, amount: string, wNativeAddress: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = data
        ? data
        : new ethers.providers.JsonRpcProvider(rpcLink);

      const contract = new ethers.Contract(wNativeAddress, wnative, provider);
      const tx = await contract.deposit({ value: ethers.utils.parseEther(amount) });
      resolve(tx);
    } catch (error) {
      reject(error);
    }
  }
  );
}

export const withdrawWNative = async (data: any, amount: string, wNativeAddress: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = data
        ? data
        : new ethers.providers.JsonRpcProvider(rpcLink);

      const contract = new ethers.Contract(wNativeAddress, wnative, provider);
      const tx = await contract.withdraw(ethers.utils.parseEther(amount));
      resolve(tx);
    } catch (error) {
      reject(error);
    }
  }
  );
}