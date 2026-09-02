import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let fixture: ComponentFixture<CardComponent>;
  let component: CardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render card with default styling', () => {
    expect(fixture.nativeElement.classList.contains('card')).toBe(true);
    expect(fixture.nativeElement.classList.contains('card-padding-md')).toBe(true);
  });

  it('should apply elevated class when elevated is true', () => {
    fixture.componentRef.setInput('elevated', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('card-elevated')).toBe(true);
  });
});
