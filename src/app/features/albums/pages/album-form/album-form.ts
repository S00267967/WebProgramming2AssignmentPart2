import { Component, OnInit, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlbumService } from '../../services/album.service';
import { AlbumDto } from '../../models/album.model';
import { ArtistService } from '../../../artists/services/artist.service';
import { LoadState, withLoadState } from '../../../../shared/load-state';
import { Artist } from '../../../artists/models/artist.model';

// One form for both "add" and "edit". The artist dropdown is filled from the artists API (related model).
@Component({
  selector: 'app-album-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './album-form.html',
})
export class AlbumForm implements OnInit {
  readonly id = input<string>();

  private readonly fb = inject(FormBuilder);
  private readonly albumService = inject(AlbumService);
  private readonly artistService = inject(ArtistService);
  private readonly router = inject(Router);

  readonly saving = signal(false);
  readonly saveError = signal<string | null>(null);
  readonly currentYear = new Date().getFullYear();

  artists = toSignal(withLoadState(this.artistService.getArtists()), {
    initialValue: { status: 'loading' } as LoadState<Artist[]>,
  });

  // validators mirror the rules in the Express zod schema
  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    artist: ['', [Validators.required]],
    releaseYear: this.fb.control<number | null>(null, [Validators.min(1900), Validators.max(this.currentYear)]),
    genre: ['', [Validators.maxLength(50)]],
    rating: this.fb.control<number | null>(null, [Validators.min(0), Validators.max(10)]),
  });

  ngOnInit(): void {
    const id = this.id();
    if (!id) return;
    this.albumService.getAlbumById(id).subscribe({
      next: (a) =>
        this.form.patchValue({
          title: a.title,
          artist: a.artist._id,
          releaseYear: a.releaseYear ?? null,
          genre: a.genre ?? '',
          rating: a.rating ?? null,
        }),
      error: (err: Error) => this.saveError.set(err.message),
    });
  }

  // true when a control should show its error message
  showError(name: 'title' | 'artist' | 'releaseYear' | 'genre' | 'rating', error: string): boolean {
    const c = this.form.controls[name];
    return c.touched && c.hasError(error);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const dto: AlbumDto = {
      title: v.title.trim(),
      artist: v.artist,
      releaseYear: v.releaseYear ?? null,
      genre: v.genre.trim() || null,
      rating: v.rating ?? null,
    };

    const id = this.id();
    const request = id ? this.albumService.updateAlbum(id, dto) : this.albumService.addAlbum(dto);

    this.saving.set(true);
    this.saveError.set(null);
    this.form.disable();
    request.subscribe({
      next: (saved) => this.router.navigate(['/albums', saved._id]),
      error: (err: Error) => {
        this.saveError.set(err.message);
        this.saving.set(false);
        this.form.enable();
      },
    });
  }
}