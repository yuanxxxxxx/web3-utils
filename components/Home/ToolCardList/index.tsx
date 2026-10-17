'use client'

import { EXTERNAL_TOOLS, INTERNAL_TOOLS } from '@/types/constant'
import {
  Section,
  SectionBlock,
  SectionTitle,
  CardGrid,
  ToolCard,
  InternalToolCard,
  CardTop,
  ToolIcon,
  ToolName,
  ToolUrl,
  OpenHint,
} from './style'

export default function ToolCardList() {
  return (
    <Section>
      <SectionBlock>
        <SectionTitle>站内工具</SectionTitle>
        <CardGrid>
          {INTERNAL_TOOLS.map((tool) => (
            <InternalToolCard key={tool.href} href={tool.href}>
              <CardTop>
                {tool.icon && <ToolIcon>{tool.icon}</ToolIcon>}
                <ToolName>{tool.name}</ToolName>
              </CardTop>
              <ToolUrl>{tool.description}</ToolUrl>
              <OpenHint>打开工具 →</OpenHint>
            </InternalToolCard>
          ))}
        </CardGrid>
      </SectionBlock>

      <SectionBlock>
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
      </SectionBlock>
    </Section>
  )
}
