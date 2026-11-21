import { Component, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { ArtistService } from '../../services/artist.service';
import { Artist } from '../../models/artist.model';
import { ArtistAlbum } from '../../../albums/models/album.model';
import { LoadState, withLoadState } from '../../../../shared/load-state';

@Component({
  selector: 'app-artist-details',
  imports: [RouterLink],
  templateUrl: './artist-details.html',
})
export class ArtistDetails {
  private readonly artistService = inject(ArtistService);
  private readonly router = inject(Router);

  // bound from the route (:id) by withComponentInputBinding()
  readonly id = input.required<string>();
  readonly deleting = signal(false);
  readonly deleteError = signal<string | null>(null);

  state = toSignal(
    toObservable(this.id).pipe(switchMap((id) => withLoadState(this.artistService.getArtistById(id)))),
    { initialValue: { status: 'loading' } as LoadState<Artist> },
  );

  albums = toSignal(
    toObservable(this.id).pipe(switchMap((id) => withLoadState(this.artistService.getAlbumsByArtist(id)))),
    { initialValue: { status: 'loading' } as LoadState<ArtistAlbum[]> },
  );

  deleteArtist(artist: Artist): void {
    if (!confirm(`Delete ${artist.name}? This also deletes all of this artist's albums.`)) return;

    this.deleting.set(true);
    this.deleteError.set(null);
    this.artistService.deleteArtist(artist._id).subscribe({
      next: () => this.router.navigate(['/artists']),
      error: (err: Error) => {
        this.deleteError.set(err.message);
        this.deleting.set(false);
      },
    });
  }
}
