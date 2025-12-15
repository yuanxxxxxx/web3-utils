'use client'

import styled from 'styled-components'
import AppSettings from '@/components/AppSettingsPage'
import { useState } from 'react'
import CModal from '@/components/Basic/CModal'
import CTooltip from '@/components/Basic/CTooltip'
import Pagination from '@/components/Basic/Pagination'

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-top: 64px;
`

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
`
const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: bold;
  color: #333;
  margin: 3rem 0 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 3px solid #0070f3;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`


export default function ExamplePage() {
  const [showModal, setShowModal] = useState(false)
  return (
    <PageContainer>
      <Main>
        <SectionTitle>⚙️ 应用设置 & 用户信息</SectionTitle>
        <Grid>
          <AppSettings />
        </Grid>
        <button onClick={() => setShowModal(true)}>Open Modal</button>
        <CTooltip overlay="Tooltip" strokeColor="#000" />
        <Pagination current={1} total={100} pageSize={10} onChange={() => {}} />

        <CModal visible={showModal} onClose={() => setShowModal(false)} title="Modal"> 
          <div>Modal</div>
        </CModal>
      </Main>
    </PageContainer>
  );
}

