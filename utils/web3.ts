import { WEBSITE_CONFIG } from "@/types/constant";

/**
 * 生成区块链浏览器的URL
 * @param value 钱包地址或交易哈希
 * @param type 值的类型："address"或"tx"
 * @returns 对应区块链浏览器的URL
 */
export const getExplorerUrl = (value: string, type: 'address' | 'tx', chainId: number): string => {
  const explorerBaseUrls: Record<number, string> = {
    1: 'https://etherscan.io',
    11155111: 'https://sepolia.etherscan.io',
    56: 'https://bscscan.com',
    97: 'https://testnet.bscscan.com'
  };

  const baseUrl = explorerBaseUrls[chainId];
  
  if (type === 'address') {
    return `${baseUrl}/address/${value}`;
  } else if (type === 'tx') {
    return `${baseUrl}/tx/${value}`;
  }
  
  return '';
}

// 获取IPFS图片URL
export const getIpfsImageUrl = (ipfsHash: string): string => {
  return ipfsHash ? `${WEBSITE_CONFIG.pinadaConfig.fileUrl}${ipfsHash}` : '';
}