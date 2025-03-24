import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  backdropUrl?: string;
  releaseDate: string;
  duration: string;
  genre: string;
  rating: number;
  overview: string;
  director: string;
  status: 'active' | 'coming-soon' | 'archived';
}

@Injectable({
  providedIn: 'root'
})
export class AdminMovieService {
  private movies: Movie[] = [
    {
      id: 1,
      title: 'The Matrix Resurrections',
      posterUrl: '/assets/images/matrix.png',
      backdropUrl: '/assets/images/matrix-backdrop.jpg',
      releaseDate: '2023-12-22',
      duration: '2h 28m',
      genre: 'Action, Sci-Fi',
      rating: 6.8,
      overview: 'Return to a world of two realities: one, everyday life; the other, what lies behind it. To find out if his reality is a physical or mental construct, Mr. Anderson, aka Neo, will have to choose to follow the white rabbit once more.',
      director: 'Lana Wachowski',
      status: 'active'
    },
    {
      id: 2,
      title: 'Dune',
      posterUrl: '/assets/images/dune.jpeg',
      backdropUrl: '/assets/images/dune-backdrop.jpg',
      releaseDate: '2023-10-22',
      duration: '2h 35m',
      genre: 'Adventure, Sci-Fi',
      rating: 8.2,
      overview: 'A noble family becomes embroiled in a war for control over the galaxy\'s most valuable asset while its heir becomes troubled by visions of a dark future.',
      director: 'Denis Villeneuve',
      status: 'active'
    },
    {
      id: 3,
      title: 'Minecraft',
      posterUrl: '/assets/images/minecraft.jpg',
      backdropUrl: '/assets/images/minecraft-backdrop.jpg',
      releaseDate: '2024-07-29',
      duration: '1h 55m',
      genre: 'Action, Adventure',
      rating: 0,
      overview: 'An upcoming film based on the popular video game where players create and break apart various kinds of blocks in three-dimensional worlds.',
      director: 'Jared Hess',
      status: 'coming-soon'
    }
  ];

  constructor() { }

  getMovies(): Observable<Movie[]> {
    return of([...this.movies]).pipe(delay(800));
  }

  getMovieById(id: number): Observable<Movie | undefined> {
    const movie = this.movies.find(m => m.id === id);
    return of(movie).pipe(delay(300));
  }

  addMovie(movie: Movie): Observable<Movie> {
    // Assign a new ID (simple implementation for mock service)
    const newId = Math.max(0, ...this.movies.map(m => m.id)) + 1;
    const newMovie = { ...movie, id: newId };
    
    this.movies.push(newMovie);
    return of(newMovie).pipe(delay(500));
  }

  updateMovie(movie: Movie): Observable<Movie> {
    const index = this.movies.findIndex(m => m.id === movie.id);
    
    if (index >= 0) {
      this.movies[index] = { ...movie };
      return of(this.movies[index]).pipe(delay(500));
    }
    
    throw new Error('Movie not found');
  }

  deleteMovie(id: number): Observable<boolean> {
    const index = this.movies.findIndex(m => m.id === id);
    
    if (index >= 0) {
      this.movies.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    
    return of(false).pipe(delay(500));
  }
}