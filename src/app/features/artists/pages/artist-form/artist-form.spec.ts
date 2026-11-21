import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ArtistForm } from './artist-form';

describe('ArtistForm validation', () => {
  it('requires a name and rejects a year before 1900', async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistForm],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    const form = TestBed.createComponent(ArtistForm).componentInstance.form;

    expect(form.valid).toBe(false);
    form.patchValue({ name: 'Radiohead', formedYear: 1800 });
    expect(form.controls.formedYear.hasError('min')).toBe(true);
    form.patchValue({ formedYear: 1985 });
    expect(form.valid).toBe(true);
  });
});
