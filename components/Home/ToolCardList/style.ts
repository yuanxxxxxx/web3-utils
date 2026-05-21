import styled from 'styled-components'

export const Section = styled.section`
  width: 100%;
`

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #101828;
  margin: 0 0 20px;
`

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`

export const ToolCard = styled.a`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px 20px;
  border-radius: 12px;
  border: 1.5px solid #e4e7ec;
  background: #fff;
  text-decoration: none;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;

  &:hover {
    border-color: #667eff;
    box-shadow: 0 4px 16px rgba(102, 126, 255, 0.12);
    transform: translateY(-2px);
  }
`

export const CardTop = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export const ToolIcon = styled.span`
  font-size: 24px;
  line-height: 1;
`

export const ToolName = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #101828;
`

export const ToolUrl = styled.span`
  font-size: 12px;
  color: #667085;
  word-break: break-all;
  line-height: 1.5;
`

export const OpenHint = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #667eff;
  margin-top: auto;
`
