import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ArtistService } from '../../services/artist.service';
import { withLoadState } from '../../../../shared/load-state';

@Component({
  selector: 'app-artist-list',
  imports: [RouterLink],
  templateUrl: './artist-list.html',
})
export class ArtistList {
  private readonly artistService = inject(ArtistService);
  state = toSignal(withLoadState(this.artistService.getArtists()), { requireSync: true });
}
