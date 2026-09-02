import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { BadgeComponent } from './badge.component';

describe('BadgeComponent', () => {
  let fixture: ComponentFixture<BadgeComponent>;
  let component: BadgeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render neutral badge by default', () => {
    expect(fixture.nativeElement.classList.contains('badge-neutral')).toBe(true);
    expect(fixture.nativeElement.classList.contains('badge-md')).toBe(true);
  });

  it('should apply WCAG 2.2 Level A/AA/AAA classes', () => {
    fixture.componentRef.setInput('variant', 'wcag-aa');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('badge-wcag-aa')).toBe(true);

    fixture.componentRef.setInput('variant', 'wcag-aaa');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('badge-wcag-aaa')).toBe(true);
  });

  it('should apply severity classes', () => {
    fixture.componentRef.setInput('variant', 'critical');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('badge-critical')).toBe(true);
  });
});
