import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MovieListComponent } from './pages/movie-list/movie-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'movies', component: MovieListComponent },
  { path: 'movies/:id', redirectTo: 'movies' }, // Temporary until we create the movie-details page
  { path: '**', redirectTo: '' }
];