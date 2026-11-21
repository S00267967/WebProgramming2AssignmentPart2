import { Component, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { AlbumService } from '../../services/album.service';
import { Album } from '../../models/album.model';
import { LoadState, withLoadState } from '../../../../shared/load-state';

@Component({
  selector: 'app-album-details',
  imports: [RouterLink],
  templateUrl: './album-details.html',
})
export class AlbumDetails {
  private readonly albumService = inject(AlbumService);
  private readonly router = inject(Router);

  readonly id = input.required<string>();
  readonly deleting = signal(false);
  readonly deleteError = signal<string | null>(null);

  state = toSignal(
    toObservable(this.id).pipe(switchMap((id) => withLoadState(this.albumService.getAlbumById(id)))),
    { initialValue: { status: 'loading' } as LoadState<Album> },
  );

  deleteAlbum(album: Album): void {
    if (!confirm(`Delete "${album.title}"?`)) return;

    this.deleting.set(true);
    this.deleteError.set(null);
    this.albumService.deleteAlbum(album._id).subscribe({
      next: () => this.router.navigate(['/albums']),
      error: (err: Error) => {
        this.deleteError.set(err.message);
        this.deleting.set(false);
      },
    });
  }
}
