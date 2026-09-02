import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TextFieldComponent } from './text-field.component';

describe('TextFieldComponent', () => {
  let fixture: ComponentFixture<TextFieldComponent>;
  let component: TextFieldComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextFieldComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TextFieldComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Audit Target URL');
    fixture.detectChanges();
  });

  it('should associate label with input via matching id and for attributes', () => {
    const labelElement: HTMLLabelElement = fixture.nativeElement.querySelector('label');
    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');

    expect(labelElement).toBeTruthy();
    expect(inputElement).toBeTruthy();
    expect(labelElement.getAttribute('for')).toBe(inputElement.id);
  });

  it('should link error message via aria-describedby and set aria-invalid', () => {
    fixture.componentRef.setInput('errorMessage', 'URL must be a valid public HTTPS link.');
    fixture.detectChanges();

    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const errorElement: HTMLParagraphElement = fixture.nativeElement.querySelector('.field-error');

    expect(inputElement.getAttribute('aria-invalid')).toBe('true');
    expect(inputElement.getAttribute('aria-describedby')).toContain(errorElement.id);
    expect(errorElement.getAttribute('role')).toBe('alert');
  });

  it('should update signal value when input changes', () => {
    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');
    inputElement.value = 'https://example.com';
    inputElement.dispatchEvent(new Event('input'));

    expect(component.value()).toBe('https://example.com');
  });
});
