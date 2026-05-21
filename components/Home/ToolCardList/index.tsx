'use client'

import { EXTERNAL_TOOLS } from '@/types/constant'
import {
  Section,
  SectionTitle,
  CardGrid,
  ToolCard,
  CardTop,
  ToolIcon,
  ToolName,
  ToolUrl,
  OpenHint,
} from './style'

export default function ToolCardList() {
  return (
    <Section>
      <SectionTitle>常用工具</SectionTitle>
      <CardGrid>
        {EXTERNAL_TOOLS.map((tool) => (
          <ToolCard
            key={tool.url}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <CardTop>
              {tool.icon && <ToolIcon>{tool.icon}</ToolIcon>}
              <ToolName>{tool.name}</ToolName>
            </CardTop>
            <ToolUrl>{tool.url}</ToolUrl>
            <OpenHint>在新标签页打开 →</OpenHint>
          </ToolCard>
        ))}
      </CardGrid>
    </Section>
  )
}
