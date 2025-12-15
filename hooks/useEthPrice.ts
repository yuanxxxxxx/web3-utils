import { useEffect, useState } from "react"
import { getCoinbaseTokenPrice } from "../request"

export default function useEthPrice() {
  const [price, setPrice] = useState("0")
  
  const refetch = () => {
    getCoinbaseTokenPrice('ETH').then((res) => {
      setPrice(res.data.data.amount)
    })
  }

  useEffect(() => {
    refetch()
  }, [])

  return {
    ethPrice: price,
    refetchEthPrice: refetch,
  }
}