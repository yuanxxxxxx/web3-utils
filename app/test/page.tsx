'use client'

import styled from 'styled-components'
import { EnvIndicator } from '@/components/Basic/EnvIndicator'
const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding-top: 64px;
`

const Main = styled.main`
  display: flex;
  min-height: 100vh;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8rem 4rem;
`

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #333;
`

const Description = styled.p`
  font-size: 1.125rem;
  color: #666;
`

export default function TestPage() {
  return (
    <PageContainer>
      <Main>
        <Title>Test</Title>
        <Description>This is the Test page</Description>
        <EnvIndicator />
      </Main>
    </PageContainer>
  );
}

