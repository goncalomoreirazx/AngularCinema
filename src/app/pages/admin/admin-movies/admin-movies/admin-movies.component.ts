import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminMovieService } from '../../../../services/admin-movie.service';

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

@Component({
  selector: 'app-admin-movies',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-movies.component.html',
  styleUrl: './admin-movies.component.scss'
})
export class AdminMoviesComponent implements OnInit {
  movies: Movie[] = [];
  selectedMovie: Movie | null = null;
  movieForm: FormGroup;
  isEditing = false;
  isLoading = true;
  showDeleteConfirmation = false;
  deleteId: number | null = null;
  formMessage = { text: '', type: '' };

  constructor(
    private adminMovieService: AdminMovieService,
    private fb: FormBuilder
  ) {
    this.movieForm = this.createMovieForm();
  }

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.isLoading = true;
    this.adminMovieService.getMovies().subscribe({
      next: (movies) => {
        this.movies = movies;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading movies:', error);
        this.isLoading = false;
      }
    });
  }

  createMovieForm(): FormGroup {
    return this.fb.group({
      id: [0],
      title: ['', [Validators.required, Validators.minLength(2)]],
      posterUrl: ['', Validators.required],
      backdropUrl: [''],
      releaseDate: ['', Validators.required],
      duration: ['', Validators.required],
      genre: ['', Validators.required],
      rating: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
      overview: ['', [Validators.required, Validators.minLength(20)]],
      director: ['', Validators.required],
      status: ['active', Validators.required]
    });
  }

  editMovie(movie: Movie): void {
    this.isEditing = true;
    this.selectedMovie = movie;
    this.movieForm.patchValue(movie);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  newMovie(): void {
    this.isEditing = false;
    this.selectedMovie = null;
    this.movieForm.reset({
      id: 0,
      status: 'active',
      rating: 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.selectedMovie = null;
    this.movieForm.reset({
      id: 0,
      status: 'active',
      rating: 0
    });
    this.formMessage = { text: '', type: '' };
  }

  confirmDelete(id: number): void {
    this.deleteId = id;
    this.showDeleteConfirmation = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
    this.deleteId = null;
  }

  deleteMovie(): void {
    if (this.deleteId) {
      this.adminMovieService.deleteMovie(this.deleteId).subscribe({
        next: () => {
          this.loadMovies();
          this.showDeleteConfirmation = false;
          this.deleteId = null;
        },
        error: (error) => {
          console.error('Error deleting movie:', error);
        }
      });
    }
  }

  saveMovie(): void {
    if (this.movieForm.invalid) {
      this.formMessage = { text: 'Please fill all required fields correctly', type: 'error' };
      return;
    }

    const movieData = this.movieForm.value;
    
    if (this.isEditing) {
      // Update existing movie
      this.adminMovieService.updateMovie(movieData).subscribe({
        next: () => {
          this.loadMovies();
          this.formMessage = { text: 'Movie updated successfully', type: 'success' };
          setTimeout(() => this.cancelEdit(), 2000);
        },
        error: (error) => {
          console.error('Error updating movie:', error);
          this.formMessage = { text: 'Error updating movie', type: 'error' };
        }
      });
    } else {
      // Create new movie
      this.adminMovieService.addMovie(movieData).subscribe({
        next: () => {
          this.loadMovies();
          this.formMessage = { text: 'Movie added successfully', type: 'success' };
          setTimeout(() => this.cancelEdit(), 2000);
        },
        error: (error) => {
          console.error('Error adding movie:', error);
          this.formMessage = { text: 'Error adding movie', type: 'error' };
        }
      });
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active': return 'Active';
      case 'coming-soon': return 'Coming Soon';
      case 'archived': return 'Archived';
      default: return status;
    }
  }
}