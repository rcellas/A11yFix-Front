import type { Meta, StoryObj } from '@storybook/angular';
import { CodeDiffViewerComponent } from './code-diff-viewer.component';

export interface CodeDiffViewerArgs {
  diffText: string;
  filename?: string;
}

const meta: Meta<CodeDiffViewerArgs> = {
  title: 'Components/CodeDiffViewer',
  component: CodeDiffViewerComponent,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<CodeDiffViewerArgs>;

const sampleDiff = `
- <div class="modal-btn" onclick="openDialog()">
-   <span>Abrir</span>
- </div>
+ <button type="button" class="btn btn-primary" aria-haspopup="dialog" (click)="openDialog()">
+   <span>Abrir</span>
+ </button>
  <div class="content-wrapper">
    <p>Contenido principal de la página</p>
  </div>
`.trim();

export const DialogRemediation: Story = {
  args: {
    filename: 'header.component.html',
    diffText: sampleDiff
  }
};

export const ColorContrastRemediation: Story = {
  args: {
    filename: 'badge.component.html',
    diffText: `- <span data-cs-mask="true" class="sc-badge" style="color: #d8d8d8; background: #ffffff;">Lanzamiento</span>\n+ <span data-cs-mask="true" class="sc-badge" style="color: #0f172a; background: #ffffff;">Lanzamiento</span>`
  }
};

export const LandmarkRemediation: Story = {
  args: {
    filename: 'app.component.html',
    diffText: `- <div class="main-content-wrapper">\n-   <section id="workspace-section">\n+ <main id="main-content" role="main" class="main-content-wrapper">\n+   <section id="workspace-section">`
  }
};

export const TouchTargetRemediation: Story = {
  args: {
    filename: 'icon-button.component.html',
    diffText: `- <button class="nav-icon" style="width: 18px; height: 18px;">\n-   <svg>...</svg>\n- </button>\n+ <button class="nav-icon" style="min-width: 24px; min-height: 24px; padding: 4px;" aria-label="Open navigation">\n+   <svg aria-hidden="true">...</svg>\n+ </button>`
  }
};
