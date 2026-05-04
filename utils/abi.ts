import { Interface } from 'ethers'

export interface AbiInput {
  name: string
  type: string
  components?: AbiInput[]
  internalType?: string
}

export interface AbiOutput {
  name: string
  type: string
  components?: AbiOutput[]
  internalType?: string
}

export interface ParsedMethod {
  name: string
  type: 'function'
  stateMutability: 'view' | 'pure' | 'nonpayable' | 'payable'
  inputs: AbiInput[]
  outputs: AbiOutput[]
  isReadOnly: boolean
}

export interface ParseAbiResult {
  methods: ParsedMethod[]
  rawAbi: any[]
  error: string | null
}

function mapAbiInputToEthers(input: AbiInput): Record<string, unknown> {
  const row: Record<string, unknown> = {
    name: input.name ?? '',
    type: input.type,
  }
  if (input.internalType) row.internalType = input.internalType
  if (input.components?.length) {
    row.components = input.components.map(mapAbiInputToEthers)
  }
  return row
}

function mapAbiOutputToEthers(output: AbiOutput): Record<string, unknown> {
  const row: Record<string, unknown> = {
    name: output.name ?? '',
    type: output.type,
  }
  if (output.internalType) row.internalType = output.internalType
  if (output.components?.length) {
    row.components = output.components.map(mapAbiOutputToEthers)
  }
  return row
}

/** 将 ParsedMethod 转为 ethers Interface 可识别的 function 片段 */
function parsedMethodToAbiFragment(method: ParsedMethod) {
  return {
    type: 'function' as const,
    name: method.name,
    stateMutability: method.stateMutability,
    inputs: method.inputs.map(mapAbiInputToEthers),
    outputs: method.outputs.map(mapAbiOutputToEthers),
  }
}

/**
 * 解析 ABI JSON 字符串，兼容纯 ABI 数组和 Hardhat/Foundry artifact 格式
 */
export function parseAbiString(abiJson: string): ParseAbiResult {
  try {
    const parsed = JSON.parse(abiJson)
    let abiArray: any[]

    if (Array.isArray(parsed)) {
      abiArray = parsed
    } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.abi)) {
      abiArray = parsed.abi
    } else {
      return { methods: [], rawAbi: [], error: 'ABI 格式错误：需要 JSON 数组或包含 abi 字段的对象' }
    }

    const methods: ParsedMethod[] = abiArray
      .filter((item: any) => item.type === 'function')
      .map((item: any) => ({
        name: item.name,
        type: 'function' as const,
        stateMutability: item.stateMutability || 'nonpayable',
        inputs: item.inputs || [],
        outputs: item.outputs || [],
        isReadOnly: item.stateMutability === 'view' || item.stateMutability === 'pure',
      }))
      .sort((a: ParsedMethod, b: ParsedMethod) => a.name.localeCompare(b.name))

    return { methods, rawAbi: abiArray, error: null }
  } catch {
    return { methods: [], rawAbi: [], error: '无效的 JSON 格式，请检查 ABI 内容' }
  }
}

/**
 * 根据 Solidity 类型获取默认的输入占位符文本
 */
export function getInputPlaceholder(solidityType: string): string {
  if (solidityType === 'address') return '0x...'
  if (solidityType === 'bool') return 'true / false'
  if (solidityType.startsWith('uint') || solidityType.startsWith('int')) return '0'
  if (solidityType === 'string') return '字符串'
  if (solidityType.startsWith('bytes')) return '0x...'
  if (solidityType.endsWith(']') || solidityType.endsWith(')')) return '[]'
  return ''
}

/**
 * 将用户输入字符串转换为合约调用所需的 JS 类型
 */
export function parseInputValue(value: string, solidityType: string): unknown {
  const trimmed = value.trim()

  // 处理数组类型
  if (solidityType.endsWith('[]') || /\[\d+\]$/.test(solidityType)) {
    try {
      const arr = JSON.parse(trimmed)
      const baseType = solidityType.replace(/\[\d*\]$/, '')
      if (Array.isArray(arr)) {
        return arr.map((item) => parseInputValue(String(item), baseType))
      }
    } catch {
      // 逗号分隔的简单数组
      return trimmed.split(',').map((item) => parseInputValue(item.trim(), solidityType.replace(/\[\d*\]$/, '')))
    }
  }

  // uint / int -> BigInt
  if (solidityType.startsWith('uint') || solidityType.startsWith('int')) {
    if (trimmed === '') return BigInt(0)
    return BigInt(trimmed)
  }

  // bool
  if (solidityType === 'bool') {
    return trimmed === 'true' || trimmed === '1'
  }

  // address
  if (solidityType === 'address') {
    return trimmed as `0x${string}`
  }

  // bytes -> hex string
  if (solidityType.startsWith('bytes')) {
    return trimmed as `0x${string}`
  }

  // tuple -> 尝试解析 JSON 对象
  if (solidityType === 'tuple') {
    try {
      return JSON.parse(trimmed)
    } catch {
      return trimmed
    }
  }

  // string 及其他
  return trimmed
}

/**
 * 格式化合约返回值为可读字符串
 */
export function formatOutputValue(value: unknown, solidityType: string): string {
  if (value === null || value === undefined) return 'null'

  if (typeof value === 'bigint') {
    return value.toString()
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }

  if (Array.isArray(value)) {
    return `[${value.map((v) => formatOutputValue(v, solidityType.replace(/\[\d*\]$/, ''))).join(', ')}]`
  }

  if (typeof value === 'object') {
    try {
      return JSON.stringify(
        value,
        (_key, val) => (typeof val === 'bigint' ? val.toString() : val),
        2
      )
    } catch {
      return String(value)
    }
  }

  return String(value)
}

/**
 * 生成函数签名字符串，如 "transfer(address,uint256)"
 */
export function getFunctionSignature(method: ParsedMethod): string {
  const params = method.inputs.map((input) => input.type).join(',')
  return `${method.name}(${params})`
}

/**
 * 函数选择器（4 字节），如 0xdd62ed3e
 */
export function getFunctionSelector(method: ParsedMethod): string {
  const iface = new Interface([parsedMethodToAbiFragment(method)])
  const types = method.inputs.map((i) => i.type)
  const fn = iface.getFunction(method.name, types)
  if (!fn) {
    throw new Error('无法从 ABI 解析函数片段')
  }
  return fn.selector
}

export interface DecodeCalldataRow {
  label: string
  value: string
}

/**
 * 解析与本方法匹配的 calldata（含 4 字节 selector），返回标签与值（用于分行着色展示）
 */
export function decodeMethodCalldataRows(method: ParsedMethod, calldata: string): DecodeCalldataRow[] {
  const trimmed = calldata.trim().replace(/\s/g, '')
  if (!trimmed) {
    throw new Error('请输入原始数据')
  }
  const hex = trimmed.startsWith('0x') ? trimmed : `0x${trimmed}`
  if (!/^0x[0-9a-fA-F]+$/.test(hex)) {
    throw new Error('无效的十六进制数据')
  }
  if (hex.length < 10) {
    throw new Error('数据过短：至少需要 4 字节函数选择器')
  }

  const iface = new Interface([parsedMethodToAbiFragment(method)])
  const types = method.inputs.map((i) => i.type)
  const fn = iface.getFunction(method.name, types)
  if (!fn) {
    throw new Error('无法从 ABI 解析函数片段')
  }
  const expectedSel = fn.selector.toLowerCase()
  const actualSel = hex.slice(0, 10).toLowerCase()
  if (expectedSel !== actualSel) {
    throw new Error(`选择器不匹配：当前方法为 ${expectedSel}，数据中 ${actualSel}`)
  }

  const decoded = iface.decodeFunctionData(fn, hex)
  if (method.inputs.length === 0) {
    return []
  }

  return method.inputs.map((input, i) => {
    const labelBase = input.name || `param${i}`
    const label = `${labelBase}(${input.type})`
    return {
      label,
      value: formatOutputValue(decoded[i], input.type),
    }
  })
}

/**
 * 解析与本方法匹配的 calldata（含 4 字节 selector），返回多行可读文本
 */
export function decodeMethodCalldata(method: ParsedMethod, calldata: string): string {
  const rows = decodeMethodCalldataRows(method, calldata)
  if (method.inputs.length === 0) {
    return '（无参数）'
  }
  return rows.map((r) => `${r.label}: ${r.value}`).join('\n')
}

/**
 * 判断 ABI 输入类型是否为数组
 */
export function isArrayType(solidityType: string): boolean {
  return solidityType.endsWith(']')
}

/**
 * 判断 ABI 输入类型是否为 tuple
 */
export function isTupleType(solidityType: string): boolean {
  return solidityType === 'tuple' || solidityType.startsWith('tuple[')
}
