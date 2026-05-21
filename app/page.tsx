'use client'

import styled from 'styled-components'
import ToolCardList from '@/components/Home/ToolCardList'
import { WEBSITE_CONFIG } from '@/types/constant'

const PageContainer = styled.div`
  min-height: 100%;
  background-color: #f5f7fa;
`

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 20px;
  box-sizing: border-box;
`

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #101828;
  margin: 0 0 8px;
`

const PageDesc = styled.p`
  font-size: 14px;
  color: #667085;
  margin: 0 0 32px;
`

export default function Home() {
  return (
    <PageContainer>
      <Main>
        <PageTitle>{WEBSITE_CONFIG.appTitle}</PageTitle>
        <PageDesc>{WEBSITE_CONFIG.appDescription}</PageDesc>
        <ToolCardList />
      </Main>
    </PageContainer>
  )
}
