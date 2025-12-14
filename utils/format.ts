import BigNumber from "bignumber.js"
// 格式化地址
export function toFormatAccount(account: string, left: number = 6, right: number = 6) {
  if (!account) {
    return ''
  }
  return account.slice(0, left) + '...' + account.slice((account.length - right), account.length)
}

export function fromValue(num: string | number, decimals?: number, dp: number = 4, roundingMode:0|1 = 1): string {
  if (!num) {
    return '0'
  }
  return new BigNumber(num).div(10 ** (decimals || 0)).dp(dp, roundingMode).toString()
}

export function toValue(num: string | number, decimals: number = 0, ): string {
  if (!num) {
    return '0'
  }
  return new BigNumber(num).multipliedBy(10 ** decimals).toString()
}

// 格式化大数单位和小数补0
export function convertToShortScale(quantity:string|number) {
  const suffixes = ["", "k", "M", "B", "T", "Q"];
  if (!quantity || +quantity === 0){
    return '0'
  }
  let quantity_ = BigNumber(quantity)
  // 处理小于0.00005的情况下格式化为0.0{5}5
  if (quantity_.lt(0.00005)) {
    const quantityStr = BigNumber(quantity_).toString()
    const decimalLen = quantityStr.split('.')[1]
    let zeroCount = 0
    for (let i = 0; i < decimalLen.length; i++) {
      if (decimalLen[i] === '0') {
        zeroCount++
      } else {
        return `0.0{${zeroCount}}${decimalLen[i]}`
      }
    }
    return quantityStr.slice(0, 5) + '5'
  }

  let index = 0;
  while (quantity_.gte(1000) && index < suffixes.length - 1) {
    quantity_ = quantity_.div(1000);
    index++;
  }

  return quantity_.dp(2).toString() + suffixes[index];
}

// 格式化数字符号+/-
export function unitsBefore(num:string|number):string {
  if (+num > 0) {
    return '+' + new BigNumber(num).abs().toString()
  }
  if (+num < 0) {
    return '-' + new BigNumber(num).abs().toString()
  }
  return '0'
}