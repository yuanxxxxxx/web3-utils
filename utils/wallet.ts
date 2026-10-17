import { english, generateMnemonic, mnemonicToAccount } from 'viem/accounts'
import { formatUnits, toHex } from 'viem'

export interface IDerivedWallet {
  index: number
  path: string
  address: `0x${string}`
  privateKey: `0x${string}`
}

export const MIN_DERIVE_COUNT = 1
export const MAX_DERIVE_COUNT = 100

const MNEMONIC_WORD_COUNTS = [12, 15, 18, 21, 24]

export function normalizeMnemonic(input: string): string {
  return input.trim().toLowerCase().split(/\s+/).filter(Boolean).join(' ')
}

export function createMnemonic(wordCount: 12 | 24): string {
  return generateMnemonic(english, wordCount === 24 ? 256 : 128)
}

export function deriveWallets(mnemonic: string, count: number): IDerivedWallet[] {
  const phrase = normalizeMnemonic(mnemonic)
  const words = phrase ? phrase.split(' ') : []
  if (!MNEMONIC_WORD_COUNTS.includes(words.length)) {
    throw new Error('助记词需要是 12、15、18、21 或 24 个英文单词')
  }
  if (!Number.isInteger(count) || count < MIN_DERIVE_COUNT || count > MAX_DERIVE_COUNT) {
    throw new Error(`派生数量需要是 ${MIN_DERIVE_COUNT} 到 ${MAX_DERIVE_COUNT} 的整数`)
  }

  try {
    mnemonicToAccount(phrase, { addressIndex: 0 })
  } catch {
    throw new Error('助记词无效，请检查单词是否正确')
  }

  return Array.from({ length: count }, (_, index) => {
    const account = mnemonicToAccount(phrase, { addressIndex: index })
    const privateKey = account.getHdKey().privateKey
    if (!privateKey) {
      throw new Error(`派生第 ${index + 1} 个地址的私钥失败`)
    }
    return {
      index,
      path: `m/44'/60'/0'/0/${index}`,
      address: account.address,
      privateKey: toHex(privateKey),
    }
  })
}

export function formatTokenAmount(value: bigint, decimals: number, maxFrac = 6): string {
  const raw = formatUnits(value, decimals)
  if (!raw.includes('.')) return raw
  const [intPart, fracPart = ''] = raw.split('.')
  const trimmed = fracPart.slice(0, maxFrac).replace(/0+$/, '')
  return trimmed ? `${intPart}.${trimmed}` : intPart
}

export async function mapPool<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  if (items.length === 0) return []
  const results = new Array<R>(items.length)
  let cursor = 0
  const size = Math.max(1, Math.min(limit, items.length))

  await Promise.all(
    Array.from({ length: size }, async () => {
      while (cursor < items.length) {
        const index = cursor
        cursor += 1
        results[index] = await worker(items[index], index)
      }
    })
  )

  return results
}
