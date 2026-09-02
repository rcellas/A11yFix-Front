import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<ButtonComponent>;
  let component: ButtonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render default button element', () => {
    const buttonElement: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement).toBeTruthy();
    expect(buttonElement.type).toBe('button');
    expect(buttonElement.classList.contains('btn-primary')).toBe(true);
    expect(buttonElement.classList.contains('btn-md')).toBe(true);
  });

  it('should emit clicked event when clicked', () => {
    let emitted = false;
    component.clicked.subscribe(() => {
      emitted = true;
    });

    const buttonElement: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    buttonElement.click();

    expect(emitted).toBe(true);
  });

  it('should not emit clicked event when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    let emitted = false;
    component.clicked.subscribe(() => {
      emitted = true;
    });

    const buttonElement: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    buttonElement.click();

    expect(emitted).toBe(false);
    expect(buttonElement.disabled).toBe(true);
    expect(buttonElement.getAttribute('aria-disabled')).toBe('true');
  });

  it('should reflect loading state with accessible aria-busy attribute', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const buttonElement: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.getAttribute('aria-busy')).toBe('true');
    expect(fixture.nativeElement.querySelector('.btn-spinner')).toBeTruthy();
  });
});
