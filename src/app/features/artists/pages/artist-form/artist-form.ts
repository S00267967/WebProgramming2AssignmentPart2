import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ArtistService } from '../../services/artist.service';
import { ArtistDto } from '../../models/artist.model';

// One form for both "add" (no id) and "edit" (id from the route)
@Component({
  selector: 'app-artist-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './artist-form.html',
})
export class ArtistForm implements OnInit {
  readonly id = input<string>();

  private readonly fb = inject(FormBuilder);
  private readonly artistService = inject(ArtistService);
  private readonly router = inject(Router);

  readonly saving = signal(false);
  readonly saveError = signal<string | null>(null);
  readonly currentYear = new Date().getFullYear();

  // validators mirror the rules in the Express zod schema
  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    country: ['', [Validators.maxLength(100)]],
    formedYear: this.fb.control<number | null>(null, [Validators.min(1900), Validators.max(this.currentYear)]),
  });

  ngOnInit(): void {
    const id = this.id();
    if (!id) return;
    this.artistService.getArtistById(id).subscribe({
      next: (a) =>
        this.form.patchValue({ name: a.name, country: a.country ?? '', formedYear: a.formedYear ?? null }),
      error: (err: Error) => this.saveError.set(err.message),
    });
  }

  // true when a control should show its error message
  showError(name: 'name' | 'country' | 'formedYear', error: string): boolean {
    const c = this.form.controls[name];
    return c.touched && c.hasError(error);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // shows every error message at once
      return;
    }
    const v = this.form.getRawValue();
    const dto: ArtistDto = {
      name: v.name.trim(),
      country: v.country.trim() || null,
      formedYear: v.formedYear ?? null,
    };

    const id = this.id();
    const request = id ? this.artistService.updateArtist(id, dto) : this.artistService.addArtist(dto);

    this.saving.set(true);
    this.saveError.set(null);
    this.form.disable();
    request.subscribe({
      next: (saved) => this.router.navigate(['/artists', saved._id]),
      error: (err: Error) => {
        this.saveError.set(err.message);
        this.saving.set(false);
        this.form.enable();
      },
    });
  }
}
