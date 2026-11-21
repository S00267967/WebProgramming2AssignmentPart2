import { Artist } from '../../artists/models/artist.model';

// GET /albums and GET /albums/:id populate `artist` with the full artist object
export interface Album {
  _id: string;
  title: string;
  artist: Artist;
  releaseYear?: number | null;
  genre?: string | null;
  rating?: number | null;
}

// GET /artists/:id/albums does NOT populate, so artist is just the id string
export type ArtistAlbum = Omit<Album, 'artist'> & { artist: string };

// what we send to the API. artist is the artist's _id.
export interface AlbumDto {
  title: string;
  artist: string;
  releaseYear: number | null;
  genre: string | null;
  rating: number | null;
}

export interface AlbumFilters {
  genre?: string;
  sort?: string;
}
