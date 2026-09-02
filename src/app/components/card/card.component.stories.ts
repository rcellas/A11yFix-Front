import type { Meta, StoryObj } from '@storybook/angular';
import { CardComponent, CardPadding } from './card.component';

export interface CardArgs {
  elevated?: boolean;
  interactive?: boolean;
  padding?: CardPadding;
}

const meta: Meta<CardArgs> = {
  title: 'Components/Card',
  component: CardComponent,
  tags: ['autodocs'],
  argTypes: {
    elevated: { control: 'boolean' },
    interactive: { control: 'boolean' },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg']
    }
  }
};

export default meta;
type Story = StoryObj<CardArgs>;

export const Default: Story = {
  args: {
    elevated: false,
    interactive: false,
    padding: 'md'
  },
  render: (args) => ({
    props: args,
    template: `
      <app-card [elevated]="elevated" [interactive]="interactive" [padding]="padding">
        <div card-header>
          <h3 style="margin: 0; font-size: 1rem; font-weight: 600;">Resumen del Hallazgo</h3>
        </div>
        <p style="margin: 0;">Elemento &lt;button&gt; sin nombre accesible detectado en la cabecera.</p>
        <div card-footer>
          <span style="font-size: 0.75rem; color: #475569;">Criterio 4.1.2 (Nivel A)</span>
        </div>
      </app-card>
    `
  })
};

export const Interactive: Story = {
  args: {
    elevated: true,
    interactive: true,
    padding: 'md'
  },
  render: (args) => ({
    props: args,
    template: `
      <app-card [elevated]="elevated" [interactive]="interactive" [padding]="padding">
        <h4 style="margin: 0 0 8px 0;">Regla: color-contrast</h4>
        <p style="margin: 0; font-size: 0.875rem;">El texto '#94a3b8' sobre fondo '#ffffff' tiene ratio 2.8:1 (requiere 4.5:1).</p>
      </app-card>
    `
  })
};
