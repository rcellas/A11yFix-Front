import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { FilterChipGroupComponent, FilterOption } from './filter-chip-group.component';

describe('FilterChipGroupComponent', () => {
  let fixture: ComponentFixture<FilterChipGroupComponent>;
  let component: FilterChipGroupComponent;

  const sampleOptions: FilterOption[] = [
    { id: 'wcag-a', label: 'Level A', count: 4, badgeVariant: 'wcag-a' },
    { id: 'wcag-aa', label: 'Level AA', count: 7, badgeVariant: 'wcag-aa' },
    { id: 'critical', label: 'Critical', count: 2, badgeVariant: 'critical' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterChipGroupComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterChipGroupComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', sampleOptions);
    fixture.detectChanges();
  });

  it('should render all filter chip buttons', () => {
    const chipButtons = fixture.nativeElement.querySelectorAll('button.chip');
    expect(chipButtons.length).toBe(3);
  });

  it('should toggle selection on click and update aria-pressed', () => {
    const firstButton: HTMLButtonElement = fixture.nativeElement.querySelectorAll('button.chip')[0];

    expect(firstButton.getAttribute('aria-pressed')).toBe('false');

    firstButton.click();
    fixture.detectChanges();

    expect(component.selectedIds()).toContain('wcag-a');
    expect(firstButton.getAttribute('aria-pressed')).toBe('true');
  });
});
