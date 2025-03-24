import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminScheduleService } from '../../../../services/admin-schedule.service';
import { AdminMovieService } from '../../../../services/admin-movie.service';

interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  duration: string;
}

interface Showtime {
  id: number;
  movieId: number;
  movieTitle: string;
  posterUrl: string;
  date: string;
  time: string;
  endTime: string;
  venue: string;
  format: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
}

@Component({
  selector: 'app-admin-schedules',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-schedules.component.html',
  styleUrl: './admin-schedules.component.scss'
})
export class AdminSchedulesComponent implements OnInit {
  showtimes: Showtime[] = [];
  filteredShowtimes: Showtime[] = [];
  movies: Movie[] = [];
  selectedShowtime: Showtime | null = null;
  showtimeForm: FormGroup;
  isEditing = false;
  isLoading = true;
  showDeleteConfirmation = false;
  deleteId: number | null = null;
  formMessage = { text: '', type: '' };
  
  // Filter variables
  dateFilter: string = '';
  movieFilter: string = '';
  venueFilter: string = '';
  
  // Dropdown options
  venues: string[] = ['Main Hall', 'Premium Screen', 'IMAX Experience'];
  formats: string[] = ['Standard', 'IMAX', 'Dolby Atmos', '3D'];

  constructor(
    private adminScheduleService: AdminScheduleService,
    private adminMovieService: AdminMovieService,
    private fb: FormBuilder
  ) {
    this.showtimeForm = this.createShowtimeForm();
  }

  ngOnInit(): void {
    this.loadShowtimes();
    this.loadMovies();
  }

  loadShowtimes(): void {
    this.isLoading = true;
    this.adminScheduleService.getShowtimes().subscribe({
      next: (showtimes) => {
        this.showtimes = showtimes;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading showtimes:', error);
        this.isLoading = false;
      }
    });
  }

  loadMovies(): void {
    this.adminMovieService.getMovies().subscribe({
      next: (movies) => {
        this.movies = movies.filter(m => m.status === 'active');
      },
      error: (error) => {
        console.error('Error loading movies:', error);
      }
    });
  }

  createShowtimeForm(): FormGroup {
    return this.fb.group({
      id: [0],
      movieId: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      venue: ['', Validators.required],
      format: ['', Validators.required],
      totalSeats: [100, [Validators.required, Validators.min(1)]],
      availableSeats: [100, [Validators.required, Validators.min(0)]],
      price: [10, [Validators.required, Validators.min(1)]]
    });
  }

  applyFilters(): void {
    let filtered = [...this.showtimes];
    
    // Apply date filter
    if (this.dateFilter) {
      filtered = filtered.filter(showtime => showtime.date === this.dateFilter);
    }
    
    // Apply movie filter
    if (this.movieFilter) {
      const movieId = parseInt(this.movieFilter);
      if (!isNaN(movieId)) {
        filtered = filtered.filter(showtime => showtime.movieId === movieId);
      }
    }
    
    // Apply venue filter
    if (this.venueFilter) {
      filtered = filtered.filter(showtime => showtime.venue === this.venueFilter);
    }
    
    this.filteredShowtimes = filtered;
  }

  onDateFilterChange(): void {
    this.applyFilters();
  }

  onMovieFilterChange(): void {
    this.applyFilters();
  }

  onVenueFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.dateFilter = '';
    this.movieFilter = '';
    this.venueFilter = '';
    this.applyFilters();
  }

  editShowtime(showtime: Showtime): void {
    this.isEditing = true;
    this.selectedShowtime = showtime;
    this.showtimeForm.patchValue({
      id: showtime.id,
      movieId: showtime.movieId,
      date: showtime.date,
      time: showtime.time,
      venue: showtime.venue,
      format: showtime.format,
      totalSeats: showtime.totalSeats,
      availableSeats: showtime.availableSeats,
      price: showtime.price
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  newShowtime(): void {
    this.isEditing = false;
    this.selectedShowtime = null;
    this.showtimeForm.reset({
      id: 0,
      totalSeats: 100,
      availableSeats: 100,
      price: 10
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.selectedShowtime = null;
    this.showtimeForm.reset({
      id: 0,
      totalSeats: 100,
      availableSeats: 100,
      price: 10
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

  deleteShowtime(): void {
    if (this.deleteId) {
      this.adminScheduleService.deleteShowtime(this.deleteId).subscribe({
        next: () => {
          this.loadShowtimes();
          this.showDeleteConfirmation = false;
          this.deleteId = null;
        },
        error: (error) => {
          console.error('Error deleting showtime:', error);
        }
      });
    }
  }

  saveShowtime(): void {
    if (this.showtimeForm.invalid) {
      this.formMessage = { text: 'Please fill all required fields correctly', type: 'error' };
      return;
    }

    const movieId = parseInt(this.showtimeForm.value.movieId);
    const movie = this.movies.find(m => m.id === movieId);
    
    if (!movie) {
      this.formMessage = { text: 'Selected movie not found', type: 'error' };
      return;
    }

    // Calculate end time based on movie duration and start time
    const [hours, minutes] = this.showtimeForm.value.time.split(':').map(Number);
    const startTime = new Date();
    startTime.setHours(hours, minutes, 0);
    
    const durationMatch = movie.duration.match(/(\d+)h\s*(\d*)m?/);
    let durationHours = 0, durationMinutes = 0;
    
    if (durationMatch) {
      durationHours = parseInt(durationMatch[1]) || 0;
      durationMinutes = parseInt(durationMatch[2]) || 0;
    }
    
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + durationHours);
    endTime.setMinutes(startTime.getMinutes() + durationMinutes);
    
    const endTimeStr = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
    
    const showtimeData = {
      ...this.showtimeForm.value,
      movieTitle: movie.title,
      posterUrl: movie.posterUrl,
      endTime: endTimeStr
    };
    
    if (this.isEditing) {
      // Update existing showtime
      this.adminScheduleService.updateShowtime(showtimeData).subscribe({
        next: () => {
          this.loadShowtimes();
          this.formMessage = { text: 'Showtime updated successfully', type: 'success' };
          setTimeout(() => this.cancelEdit(), 2000);
        },
        error: (error) => {
          console.error('Error updating showtime:', error);
          this.formMessage = { text: 'Error updating showtime', type: 'error' };
        }
      });
    } else {
      // Create new showtime
      this.adminScheduleService.addShowtime(showtimeData).subscribe({
        next: () => {
          this.loadShowtimes();
          this.formMessage = { text: 'Showtime added successfully', type: 'success' };
          setTimeout(() => this.cancelEdit(), 2000);
        },
        error: (error) => {
          console.error('Error adding showtime:', error);
          this.formMessage = { text: 'Error adding showtime', type: 'error' };
        }
      });
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getMovieTitleById(id: number): string {
    const movie = this.movies.find(m => m.id === id);
    return movie ? movie.title : 'Unknown Movie';
  }

  // Get unique dates from showtimes for date filter
  get uniqueDates(): string[] {
    const dates = this.showtimes.map(s => s.date);
    return [...new Set(dates)].sort();
  }
}