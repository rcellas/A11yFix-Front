import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { CodeDiffViewerComponent } from './code-diff-viewer.component';

describe('CodeDiffViewerComponent', () => {
  let fixture: ComponentFixture<CodeDiffViewerComponent>;
  let component: CodeDiffViewerComponent;

  const sampleDiff = `
- <div onclick="openModal()">Open</div>
+ <button type="button" aria-haspopup="dialog" (click)="openModal()">Open</button>
   <span>Context line</span>
  `.trim();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeDiffViewerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CodeDiffViewerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('diffText', sampleDiff);
    fixture.detectChanges();
  });

  it('should parse added, removed, and context lines correctly', () => {
    const lines = fixture.nativeElement.querySelectorAll('.diff-line');
    expect(lines.length).toBe(3);

    expect(lines[0].classList.contains('diff-line-removed')).toBe(true);
    expect(lines[1].classList.contains('diff-line-added')).toBe(true);
    expect(lines[2].classList.contains('diff-line-context')).toBe(true);
  });

  it('should include accessible region label', () => {
    const container: HTMLElement = fixture.nativeElement.querySelector('.diff-container');
    expect(container.getAttribute('role')).toBe('region');
    expect(container.getAttribute('aria-label')).toContain('remediation.html');
  });
});
