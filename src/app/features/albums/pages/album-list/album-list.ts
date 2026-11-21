import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, startWith, switchMap } from 'rxjs';
import { AlbumService } from '../../services/album.service';
import { Album } from '../../models/album.model';
import { LoadState, withLoadState } from '../../../../shared/load-state';

@Component({
  selector: 'app-album-list',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './album-list.html',
})
export class AlbumList {
  private readonly albumService = inject(AlbumService);
  private readonly fb = inject(FormBuilder);

  filters = this.fb.nonNullable.group({ genre: '', sort: 'title' });

  // Every change to the filter form re-queries the API (after a short pause while typing)
  state = toSignal(
    this.filters.valueChanges.pipe(
      startWith(this.filters.getRawValue()),
      debounceTime(300),
      switchMap((f) => withLoadState(this.albumService.getAlbums({ genre: f.genre, sort: f.sort }))),
    ),
    { initialValue: { status: 'loading' } as LoadState<Album[]> },
  );
}
