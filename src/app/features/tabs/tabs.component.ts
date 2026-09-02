import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  input,
  model,
  viewChildren
} from '@angular/core';

export interface TabItem {
  readonly id: string;
  readonly label: string;
  readonly icon?: string;
  readonly badge?: string;
}

let tabsId = 0;

@Component({
  selector: 'app-tabs',
  imports: [],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.tabs-host]': 'true'
  }
})
export class TabsComponent {
  readonly id = input<string>(`app-tabs-${tabsId++}`);
  readonly tabs = input.required<readonly TabItem[]>();
  readonly ariaLabel = input<string>('Pestañas de navegación');

  readonly activeTabId = model<string>('');

  protected readonly tabButtonElements = viewChildren<ElementRef<HTMLButtonElement>>('tabButton');

  protected readonly currentActiveId = computed(() => {
    const active = this.activeTabId();
    if (active) return active;
    const first = this.tabs()[0];
    return first ? first.id : '';
  });

  protected selectTab(id: string): void {
    this.activeTabId.set(id);
  }

  // WAI-ARIA APG: Arrow navigation across tabs
  protected handleKeyDown(event: KeyboardEvent, currentIndex: number): void {
    const tabList = this.tabs();
    const count = tabList.length;
    if (count === 0) return;

    let nextIndex: number | null = null;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % count;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + count) % count;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = count - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      const nextTab = tabList[nextIndex];
      this.selectTab(nextTab.id);
      const buttons = this.tabButtonElements();
      buttons[nextIndex]?.nativeElement.focus();
    }
  }
}
