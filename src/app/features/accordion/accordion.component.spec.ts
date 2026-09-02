import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { AccordionComponent } from './accordion.component';

describe('AccordionComponent', () => {
  let fixture: ComponentFixture<AccordionComponent>;
  let component: AccordionComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AccordionComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'WCAG 2.2 Level AA Requirements');
    fixture.detectChanges();
  });

  it('should be collapsed by default with aria-expanded false', () => {
    const trigger: HTMLButtonElement = fixture.nativeElement.querySelector('button.accordion-trigger');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    const panel: HTMLElement = fixture.nativeElement.querySelector('.accordion-panel');
    expect(panel.hidden).toBe(true);
  });

  it('should toggle expanded state on click and update aria-expanded', () => {
    const trigger: HTMLButtonElement = fixture.nativeElement.querySelector('button.accordion-trigger');
    trigger.click();
    fixture.detectChanges();

    expect(component.expanded()).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    const panel: HTMLElement = fixture.nativeElement.querySelector('.accordion-panel');
    expect(panel.hidden).toBe(false);
  });
});
