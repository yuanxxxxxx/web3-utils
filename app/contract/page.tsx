'use client'

import styled from 'styled-components'
import ContractCallTool from '@/components/ContractCall'

const PageContainer = styled.div`
  min-height: 100%;
  background-color: #f5f7fa;
`

const Main = styled.main`
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 20px;
  box-sizing: border-box;
`

export default function ContractPage() {
  return (
    <PageContainer>
      <Main>
        <ContractCallTool />
      </Main>
    </PageContainer>
  )
}
