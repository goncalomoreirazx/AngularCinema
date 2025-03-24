import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

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

@Injectable({
  providedIn: 'root'
})
export class AdminScheduleService {
  private showtimes: Showtime[] = [
    {
      id: 1,
      movieId: 1,
      movieTitle: 'The Matrix Resurrections',
      posterUrl: '/assets/images/matrix.png',
      date: '2025-03-26',
      time: '14:30',
      endTime: '17:00',
      venue: 'Main Hall',
      format: 'Standard',
      totalSeats: 150,
      availableSeats: 87,
      price: 12.99
    },
    {
      id: 2,
      movieId: 1,
      movieTitle: 'The Matrix Resurrections',
      posterUrl: '/assets/images/matrix.png',
      date: '2025-03-26',
      time: '19:15',
      endTime: '21:45',
      venue: 'IMAX Experience',
      format: 'IMAX',
      totalSeats: 120,
      availableSeats: 42,
      price: 16.99
    },
    {
      id: 3,
      movieId: 2,
      movieTitle: 'Dune',
      posterUrl: '/assets/images/dune.jpeg',
      date: '2025-03-26',
      time: '16:00',
      endTime: '18:40',
      venue: 'Premium Screen',
      format: 'Dolby Atmos',
      totalSeats: 80,
      availableSeats: 23,
      price: 14.99
    },
    {
      id: 4,
      movieId: 2,
      movieTitle: 'Dune',
      posterUrl: '/assets/images/dune.jpeg',
      date: '2025-03-27',
      time: '15:30',
      endTime: '18:10',
      venue: 'Main Hall',
      format: 'Standard',
      totalSeats: 150,
      availableSeats: 120,
      price: 12.99
    },
    {
      id: 5,
      movieId: 1,
      movieTitle: 'The Matrix Resurrections',
      posterUrl: '/assets/images/matrix.png',
      date: '2025-03-27',
      time: '20:00',
      endTime: '22:30',
      venue: 'Main Hall',
      format: 'Standard',
      totalSeats: 150,
      availableSeats: 150,
      price: 12.99
    }
  ];

  constructor() { }

  getShowtimes(): Observable<Showtime[]> {
    return of([...this.showtimes]).pipe(delay(800));
  }

  getShowtimeById(id: number): Observable<Showtime | undefined> {
    const showtime = this.showtimes.find(s => s.id === id);
    return of(showtime).pipe(delay(300));
  }

  getShowtimesByMovieId(movieId: number): Observable<Showtime[]> {
    const movieShowtimes = this.showtimes.filter(s => s.movieId === movieId);
    return of(movieShowtimes).pipe(delay(500));
  }

  getShowtimesByDate(date: string): Observable<Showtime[]> {
    const dateShowtimes = this.showtimes.filter(s => s.date === date);
    return of(dateShowtimes).pipe(delay(500));
  }

  addShowtime(showtime: Showtime): Observable<Showtime> {
    // Assign a new ID (simple implementation for mock service)
    const newId = Math.max(0, ...this.showtimes.map(s => s.id)) + 1;
    const newShowtime = { ...showtime, id: newId };
    
    this.showtimes.push(newShowtime);
    return of(newShowtime).pipe(delay(500));
  }

  updateShowtime(showtime: Showtime): Observable<Showtime> {
    const index = this.showtimes.findIndex(s => s.id === showtime.id);
    
    if (index >= 0) {
      this.showtimes[index] = { ...showtime };
      return of(this.showtimes[index]).pipe(delay(500));
    }
    
    throw new Error('Showtime not found');
  }

  deleteShowtime(id: number): Observable<boolean> {
    const index = this.showtimes.findIndex(s => s.id === id);
    
    if (index >= 0) {
      this.showtimes.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    
    return of(false).pipe(delay(500));
  }
}