export interface Artist {
  _id: string;
  name: string;
  country?: string | null;
  formedYear?: number | null;
}

// what we send to the API (no _id). null clears an optional field.
export interface ArtistDto {
  name: string;
  country: string | null;
  formedYear: number | null;
}
