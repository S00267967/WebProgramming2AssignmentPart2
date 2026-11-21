import { Routes } from '@angular/router';

// loadComponent = lazy loading, each page is only downloaded when first visited
// 'new' routes are listed before ':id' so "new" is not treated as an id
export const routes: Routes = [
  { path: '', redirectTo: 'albums', pathMatch: 'full' },
  {
    path: '',
    title: 'Albums'
  },
  {
    path: 'albums/new',
    title: 'New album'
  },
  {
    path: '',
    title: 'Album details'
  },
  {
    path: '',
    title: 'Edit album'
  },
  {
    path: '',
    title: 'Artists'
  },
  {
    path: '',
    title: 'New artist'
  },
  {
    path: '',
    title: 'Artist details'
  },
  {
    path: '',
    title: 'Edit artist'
  },
  { path: '**', redirectTo: 'albums' },
];
