'use client'

import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

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

export default function Home() {
  const { t } = useTranslation()
  return (
    <PageContainer>
      <Main>
        <Title>Home</Title>
      </Main>
    </PageContainer>
  );
}
