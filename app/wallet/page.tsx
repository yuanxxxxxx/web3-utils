'use client'

import styled from 'styled-components'
import WalletGenerate from '@/components/WalletGenerate'

const PageContainer = styled.div`
  min-height: 100%;
  background-color: #f5f7fa;
`

const Main = styled.main`
  max-width: 1040px;
  margin: 0 auto;
  padding: 32px 20px;
  box-sizing: border-box;
`

export default function WalletPage() {
  return (
    <PageContainer>
      <Main>
        <WalletGenerate />
      </Main>
    </PageContainer>
  )
}
