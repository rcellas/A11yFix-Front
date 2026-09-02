import type { Meta, StoryObj } from '@storybook/angular';
import { CodeDiffViewerComponent } from './code-diff-viewer.component';

const meta: Meta<CodeDiffViewerComponent> = {
  title: 'Components/CodeDiffViewer',
  component: CodeDiffViewerComponent,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<CodeDiffViewerComponent>;

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
