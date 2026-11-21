import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AlbumService } from './album.service';
import { environment } from '../../../../enviroments/enviroments';
import { afterEach,beforeEach, describe, expect, it } from 'vitest';

describe('AlbumService', () => {
  let service: AlbumService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(AlbumService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('GETs albums with the genre filter', () => {
    service.getAlbums({ genre: 'Rock', sort: 'title' }).subscribe();
    const req = http.expectOne((r) => r.url === `${environment.apiUrl}/albums`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('genre')).toBe('Rock');
    req.flush([]);
  });

  it('DELETEs an album by id', () => {
    service.deleteAlbum('abc').subscribe();
    const req = http.expectOne(`${environment.apiUrl}/albums/abc`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
