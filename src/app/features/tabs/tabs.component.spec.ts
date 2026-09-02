import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TabItem, TabsComponent } from './tabs.component';

describe('TabsComponent', () => {
  let fixture: ComponentFixture<TabsComponent>;
  let component: TabsComponent;

  const testTabs: TabItem[] = [
    { id: 'dialog', label: 'Dialog Pattern', badge: 'APG' },
    { id: 'tabs', label: 'Tabs Pattern' },
    { id: 'combobox', label: 'Combobox Pattern' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tabs', testTabs);
    fixture.detectChanges();
  });

  it('should render tablist with tab items', () => {
    const tablist = fixture.nativeElement.querySelector('[role="tablist"]');
    const tabs = fixture.nativeElement.querySelectorAll('[role="tab"]');
    expect(tablist).toBeTruthy();
    expect(tabs.length).toBe(3);
  });

  it('should select first tab by default with aria-selected true and tabindex 0', () => {
    const tabs: HTMLButtonElement[] = fixture.nativeElement.querySelectorAll('[role="tab"]');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[0].tabIndex).toBe(0);
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
    expect(tabs[1].tabIndex).toBe(-1);
  });

  it('should switch tab on click', () => {
    const tabs: HTMLButtonElement[] = fixture.nativeElement.querySelectorAll('[role="tab"]');
    tabs[1].click();
    fixture.detectChanges();

    expect(component.activeTabId()).toBe('tabs');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].tabIndex).toBe(0);
  });
});
