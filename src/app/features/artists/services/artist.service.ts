import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroments';
import { Artist, ArtistDto } from '../models/artist.model';
import { ArtistAlbum } from '../../albums/models/ablum.model';

@Injectable({ providedIn: 'root' })
export class ArtistService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/artists`;

  getArtists(): Observable<Artist[]> {
    return this.http.get<Artist[]>(this.apiUrl);
  }

  getArtistById(id: string): Observable<Artist> {
    return this.http.get<Artist>(`${this.apiUrl}/${id}`);
  }

  // uses the related-data route GET /artists/:id/albums
  getAlbumsByArtist(id: string): Observable<ArtistAlbum[]> {
    return this.http.get<ArtistAlbum[]>(`${this.apiUrl}/${id}/albums`);
  }

  addArtist(artist: ArtistDto): Observable<Artist> {
    return this.http.post<Artist>(this.apiUrl, artist);
  }

  updateArtist(id: string, artist: ArtistDto): Observable<Artist> {
    return this.http.put<Artist>(`${this.apiUrl}/${id}`, artist);
  }

  deleteArtist(id: string): Observable<Artist> {
    return this.http.delete<Artist>(`${this.apiUrl}/${id}`);
  }
}
