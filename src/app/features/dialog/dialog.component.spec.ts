import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { DialogComponent } from './dialog.component';

describe('DialogComponent', () => {
  let fixture: ComponentFixture<DialogComponent>;
  let component: DialogComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Confirm Remediation');
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
  });

  it('should render dialog with role dialog, aria-modal, and linked title', () => {
    const dialogElement: HTMLElement = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(dialogElement).toBeTruthy();
    expect(dialogElement.getAttribute('aria-modal')).toBe('true');

    const titleElement: HTMLElement = fixture.nativeElement.querySelector('.dialog-title');
    expect(dialogElement.getAttribute('aria-labelledby')).toBe(titleElement.id);
  });

  it('should emit closed when close button is clicked', () => {
    let closedEmitted = false;
    component.closed.subscribe(() => {
      closedEmitted = true;
    });

    const closeButton: HTMLButtonElement = fixture.nativeElement.querySelector('app-button button');
    closeButton.click();

    expect(closedEmitted).toBe(true);
  });
});
