'use client'

import { useState, useEffect } from 'react'
import { parseAbiString, ParsedMethod } from '@/utils/abi'

export default function useAbiParser(abiString: string) {
  const [readMethods, setReadMethods] = useState<ParsedMethod[]>([])
  const [writeMethods, setWriteMethods] = useState<ParsedMethod[]>([])
  const [parseError, setParseError] = useState<string | null>(null)
  const [rawAbi, setRawAbi] = useState<any[]>([])

  useEffect(() => {
    const trimmed = abiString.trim()
    if (!trimmed) {
      setReadMethods([])
      setWriteMethods([])
      setParseError(null)
      setRawAbi([])
      return
    }

    const result = parseAbiString(trimmed)
    if (result.error) {
      setParseError(result.error)
      setReadMethods([])
      setWriteMethods([])
      setRawAbi([])
    } else {
      setParseError(null)
      setRawAbi(result.rawAbi)
      setReadMethods(result.methods.filter((m: ParsedMethod) => m.isReadOnly))
      setWriteMethods(result.methods.filter((m: ParsedMethod) => !m.isReadOnly))
    }
  }, [abiString])

  return {
    readMethods,
    writeMethods,
    parseError,
    rawAbi,
    totalMethods: readMethods.length + writeMethods.length,
  }
}
