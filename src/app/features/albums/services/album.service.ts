import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroments';
import { Album, AlbumDto, AlbumFilters } from '../models/album.model';

@Injectable({ providedIn: 'root' })
export class AlbumService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/albums`;

  // genre/sort map onto the query-string filters the Express API supports
  getAlbums(filters: AlbumFilters = {}): Observable<Album[]> {
    let params = new HttpParams().set('limit', 100);
    if (filters.genre?.trim()) params = params.set('genre', filters.genre.trim());
    if (filters.sort) params = params.set('sort', filters.sort);
    return this.http.get<Album[]>(this.apiUrl, { params });
  }

  getAlbumById(id: string): Observable<Album> {
    return this.http.get<Album>(`${this.apiUrl}/${id}`);
  }

  addAlbum(album: AlbumDto): Observable<Album> {
    return this.http.post<Album>(this.apiUrl, album);
  }

  updateAlbum(id: string, album: AlbumDto): Observable<Album> {
    return this.http.put<Album>(`${this.apiUrl}/${id}`, album);
  }

  deleteAlbum(id: string): Observable<Album> {
    return this.http.delete<Album>(`${this.apiUrl}/${id}`);
  }
}
