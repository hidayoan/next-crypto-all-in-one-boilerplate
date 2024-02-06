
export const generateCode = (value: string, size = 4) => {
  if (!(value && value.length > size)) {
    return value
  }
  let length = value.length
  let tempText = "";
  for (let i = 0; i < size; i++) {
    tempText += value[i];
  }
  tempText += '...';
  for (let i = length - size; i <= length - 1; i++) {
    tempText += value[i];
  }
  return tempText;
}

export const caculateAPR = (tokenPerSecond: number, totalStake: number, type = 'YOUR_TOKEN_NAME') => {
  if (type === 'YOUR_TOKEN_NAME') {
    const apr = (31556926 * tokenPerSecond * 0.1) / (totalStake * 1.2);
    return apr.toFixed(0);
  } else if (type === 'usdt') {
    const apr = (31556926 * tokenPerSecond * 0.1) / (totalStake * 1);
    return apr.toFixed(0);
  } else {
    //(31556926 * tokenPerSecond*(10**-18) * giá token reward( tạm thời gán cứng là 0.1)) / (totalStake*(10**-18) * giá token deposit(0.1))
    const apr = (31556926 * tokenPerSecond * 0.1) / (totalStake * 0.1);
    return apr.toFixed(0);
  }
}

export const caculateYieldAPR = (tokenPerSecond: number, totalStake: number, type = 'eth') => {
  if (type === 'eth-usdc' || type === 'sydx-eth') {
    const price = type.includes('usdc') ? 1 : 0.1
    // (31556926 * tokenPerSecond*(10**-18) * giá token reward( tạm thời gán cứng là 0.1)) / ((totalStakeToken1*(10**-decimals) * giá token1 deposit) + (totalStakeToken2*(10**-decimals) * giá token2 deposit))
    const apr = (31556926 * tokenPerSecond) * 0.1 / (totalStake * 1800 + totalStake * price);
    return apr.toFixed(0);
  } else {
    const apr = (31556926 * tokenPerSecond) * 0.1 / (totalStake * 1 + totalStake * 0.1);
    return apr.toFixed(0);
  }
}
export function roundDown(number: number, decimalPlaces = 0) {

  const factor = 10 ** decimalPlaces;
  return Math.floor(number * factor) / factor;
}

export function formatNumber(val: string, minimumFractionDigits = 2, maximumFractionDigits = 2) {
  const number = parseFloat(val);
  const formattedNumber = number.toLocaleString('en-US', {
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits, // Set a high maximum to prevent rounding
    useGrouping: true,
    currency: 'USD',
    style: 'decimal',
  });
  if (Number.isInteger(number)) {
    // If the number is an integer, remove the ".00" decimal part
    return formattedNumber.replace(/\.00$/, '');
  } else {
    return formattedNumber;
  }
}

export const checkNativeToken = (val: string) => {
  if (val === process.env.NEXT_PUBLIC__NATIVE_ADDRESS) {
    return process.env.NEXT_PUBLIC__WRAP_NATIVE_ADDRESS;
  }
  return val;
}