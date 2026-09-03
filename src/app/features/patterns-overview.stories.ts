import type { Meta, StoryObj } from '@storybook/angular';
import { APG_PATTERNS } from '../core/models/pattern/pattern-catalog';

const meta: Meta = {
  title: 'Patterns/APG Pattern Engine (9 Patterns)',
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj;

export const AllPatternsCatalog: Story = {
  render: () => ({
    template: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 1000px; margin: 0 auto; padding: 1.5rem;">
        <header style="margin-bottom: 2rem;">
          <h2 style="margin: 0 0 0.5rem 0; font-size: 1.5rem; font-weight: 700; color: #0f172a;">WAI-ARIA APG Pattern Catalog (9 Supported Patterns)</h2>
          <p style="margin: 0; color: #475569; font-size: 0.875rem; line-height: 1.5;">
            Official W3C WAI-ARIA Authoring Practices Guide requirements for accessible interactive components. Verified by A11yFix WebMCP.
          </p>
        </header>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem;">
          ${Object.entries(APG_PATTERNS)
            .map(
              ([key, p]) => `
            <article style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem;">
                <h3 style="margin: 0; font-size: 1rem; font-weight: 700; color: #0f172a;">${p.name}</h3>
                <span style="font-family: monospace; font-size: 0.7rem; font-weight: 700; background: #eef2ff; color: #4338ca; padding: 2px 6px; border-radius: 4px;">${key}</span>
              </div>
              <p style="margin: 0; font-size: 0.8125rem; color: #334155; line-height: 1.45;">${p.description}</p>
              
              <div style="margin-top: 0.25rem;">
                <strong style="font-size: 0.75rem; color: #0f172a; text-transform: uppercase; letter-spacing: 0.04em;">Required Roles & Attributes:</strong>
                <ul style="margin: 0.35rem 0 0 0; padding-left: 1.25rem; font-size: 0.75rem; color: #475569; font-family: monospace;">
                  ${p.requiredAttributes.map((attr) => `<li style="margin-bottom: 2px;"><code>${attr}</code></li>`).join('')}
                </ul>
              </div>

              <div style="margin-top: 0.25rem;">
                <strong style="font-size: 0.75rem; color: #0f172a; text-transform: uppercase; letter-spacing: 0.04em;">Keyboard Interaction:</strong>
                <ul style="margin: 0.35rem 0 0 0; padding-left: 1.25rem; font-size: 0.75rem; color: #334155;">
                  ${p.keyboardRequirements.map((kb) => `<li style="margin-bottom: 2px;">${kb}</li>`).join('')}
                </ul>
              </div>

              <div style="margin-top: auto; padding-top: 0.5rem; border-top: 1px solid #f1f5f9;">
                <a href="${p.apgReferenceUrl}" target="_blank" rel="noopener noreferrer" style="font-size: 0.75rem; color: #4338ca; font-weight: 600; text-decoration: none;">
                  W3C APG Specification ↗
                </a>
              </div>
            </article>
          `
            )
            .join('')}
        </div>
      </div>
    `
  })
};
