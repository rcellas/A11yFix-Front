import type { Meta, StoryObj } from '@storybook/angular';
import { TabItem, TabsComponent } from './tabs.component';

interface TabsArgs {
  tabs: readonly TabItem[];
  activeTabId: string;
  ariaLabel: string;
}

const sampleTabs: readonly TabItem[] = [
  { id: 'findings', label: 'Audit Findings', badge: '154' },
  { id: 'patterns', label: 'WAI-ARIA Patterns', badge: '9' },
  { id: 'telemetry', label: 'WebMCP Telemetry', badge: 'Active' }
];

const meta: Meta<TabsArgs> = {
  title: 'Patterns/Tabs (WAI-ARIA Tablist)',
  component: TabsComponent,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<TabsArgs>;

export const DefaultTabs: Story = {
  args: {
    tabs: sampleTabs,
    activeTabId: 'findings',
    ariaLabel: 'Accessibility QA views'
  },
  render: (args) => ({
    props: args,
    template: `
      <app-tabs [tabs]="tabs" [activeTabId]="activeTabId" [ariaLabel]="ariaLabel">
        <div style="padding: 1.5rem; background: #fff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="margin: 0; color: #0f172a; font-weight: 600;">Active Tab Content: {{ activeTabId }}</p>
          <p style="margin: 0.5rem 0 0; color: #475569; font-size: 0.875rem;">Supports Left/Right arrow keys, Home, and End per WAI-ARIA APG Tabs pattern.</p>
        </div>
      </app-tabs>
    `
  })
};
