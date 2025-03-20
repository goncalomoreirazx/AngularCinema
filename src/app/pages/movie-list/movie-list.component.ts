import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieCardComponent } from '../../components/movies/movie-card/movie-card.component';
import { AuthService } from '../../services/auth.service';

interface Movie {
  id: number;
  title: string;
  poster: string;
  year: number;
  director: string;
  genre: string;
  rating: number;
}

type SortOption = 'rating' | 'year-desc' | 'year-asc' | 'title';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MovieCardComponent],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss',
  host: { class: 'movie-list-page' }
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  displayedMovies: Movie[] = [];
  selectedSort: SortOption = 'rating';
  
  // Original movie data
  private originalMovies: Movie[] = [
    {
      id: 1,
      title: 'The Shawshank Redemption',
      poster: '/api/placeholder/300/450?text=Shawshank+Redemption',
      year: 1994,
      director: 'Frank Darabont',
      genre: 'Drama',
      rating: 9.3
    },
    {
      id: 2,
      title: 'The Godfather',
      poster: '/api/placeholder/300/450?text=The+Godfather',
      year: 1972,
      director: 'Francis Ford Coppola',
      genre: 'Crime, Drama',
      rating: 9.2
    },
    {
      id: 3,
      title: 'The Dark Knight',
      poster: '/api/placeholder/300/450?text=The+Dark+Knight',
      year: 2008,
      director: 'Christopher Nolan',
      genre: 'Action, Crime, Drama',
      rating: 9.0
    },
    {
      id: 4,
      title: 'Pulp Fiction',
      poster: '/api/placeholder/300/450?text=Pulp+Fiction',
      year: 1994,
      director: 'Quentin Tarantino',
      genre: 'Crime, Drama',
      rating: 8.9
    },
    {
      id: 5,
      title: 'The Lord of the Rings: The Return of the King',
      poster: '/api/placeholder/300/450?text=LOTR+Return+of+the+King',
      year: 2003,
      director: 'Peter Jackson',
      genre: 'Adventure, Drama, Fantasy',
      rating: 9.0
    },
    {
      id: 6,
      title: 'Forrest Gump',
      poster: '/api/placeholder/300/450?text=Forrest+Gump',
      year: 1994,
      director: 'Robert Zemeckis',
      genre: 'Drama, Romance',
      rating: 8.8
    }
  ];

  constructor(private router: Router,  public authService: AuthService ) {}
  
  ngOnInit(): void {
    // Initialize with the original data
    this.movies = [...this.originalMovies];
    this.sortMovies(this.selectedSort);
  }

  sortMovies(sortOption: SortOption): void {
    // Create a new array to avoid mutating the original
    this.displayedMovies = [...this.movies];
    
    switch(sortOption) {
      case 'rating':
        this.displayedMovies.sort((a, b) => b.rating - a.rating);
        break;
      case 'year-desc':
        this.displayedMovies.sort((a, b) => b.year - a.year);
        break;
      case 'year-asc':
        this.displayedMovies.sort((a, b) => a.year - b.year);
        break;
      case 'title':
        this.displayedMovies.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
  }
  
  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedSort = select.value as SortOption;
    this.sortMovies(this.selectedSort);
  }

  navigateToDetails(id: number): void {
    this.router.navigate(['/movies', id]);
  }

  navigateToBooking(movieId: number): void {
    this.router.navigate(['/booking', movieId]);
  }
  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }
  
}