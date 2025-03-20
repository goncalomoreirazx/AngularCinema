// src/app/services/ticket.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Seat {
  id: string;
  row: string;
  number: number;
  type: 'standard' | 'premium' | 'vip';
  price: number;
  isAvailable: boolean;
  isSelected?: boolean;
}

export interface Showtime {
  id: number;
  movieId: number;
  date: string;
  time: string;
  venue: string;
  format: string;
  seatsAvailable: number;
}

export interface Booking {
  id?: number;
  userId: number;
  movieId: number;
  movieTitle: string;
  moviePoster: string;
  showtimeId: number;
  showtime: string;
  venue: string;
  seats: Seat[];
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  bookingDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private selectedSeatsSubject = new BehaviorSubject<Seat[]>([]);
  selectedSeats$ = this.selectedSeatsSubject.asObservable();

  private selectedShowtimeSubject = new BehaviorSubject<Showtime | null>(null);
  selectedShowtime$ = this.selectedShowtimeSubject.asObservable();

  private bookingSubject = new BehaviorSubject<Booking | null>(null);
  booking$ = this.bookingSubject.asObservable();

  constructor(private authService: AuthService) {}

  // Mock data for showtimes
  getShowtimesByMovie(movieId: number): Showtime[] {
    // Generate showtimes for the next 7 days
    const showtimes: Showtime[] = [];
    const venues = ['Main Hall', 'Premium Screen', 'IMAX Experience'];
    const formats = ['Standard', 'IMAX', 'Dolby Atmos', '3D'];
    
    // Current date
    const today = new Date();
    
    // Generate showtimes for the next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      // Format date as YYYY-MM-DD
      const dateStr = date.toISOString().split('T')[0];
      
      // Generate 3-4 showtimes per day
      const numShowtimes = 3 + Math.floor(Math.random() * 2);
      
      for (let j = 0; j < numShowtimes; j++) {
        // Generate a time between 10:00 and 22:00
        const hour = 10 + Math.floor(Math.random() * 12);
        const minute = Math.random() > 0.5 ? '00' : '30';
        const time = `${hour}:${minute}`;
        
        showtimes.push({
          id: showtimes.length + 1,
          movieId,
          date: dateStr,
          time,
          venue: venues[Math.floor(Math.random() * venues.length)],
          format: formats[Math.floor(Math.random() * formats.length)],
          seatsAvailable: 50 + Math.floor(Math.random() * 100)
        });
      }
    }
    
    return showtimes;
  }

  // Generate a mock seat map
  generateSeatMap(showtimeId: number): Seat[] {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 12;
    const seats: Seat[] = [];
    
    rows.forEach(row => {
      for (let i = 1; i <= seatsPerRow; i++) {
        // Determine seat type and price
        let type: 'standard' | 'premium' | 'vip' = 'standard';
        let price = 10;
        
        if (row === 'G' || row === 'H') {
          type = 'premium';
          price = 15;
        } else if (row === 'D' || row === 'E') {
          type = 'vip';
          price = 20;
        }
        
        // Randomly mark some seats as unavailable
        const isAvailable = Math.random() > 0.2;
        
        seats.push({
          id: `${row}${i}`,
          row,
          number: i,
          type,
          price,
          isAvailable
        });
      }
    });
    
    return seats;
  }

  // Update selected seats
  selectSeat(seat: Seat): void {
    if (!seat.isAvailable) return;
    
    const currentSeats = this.selectedSeatsSubject.value;
    const seatIndex = currentSeats.findIndex(s => s.id === seat.id);
    
    if (seatIndex >= 0) {
      // Remove seat if already selected
      const updatedSeats = [...currentSeats];
      updatedSeats.splice(seatIndex, 1);
      this.selectedSeatsSubject.next(updatedSeats);
    } else {
      // Add seat to selection
      this.selectedSeatsSubject.next([...currentSeats, seat]);
    }
  }

  // Set selected showtime
  selectShowtime(showtime: Showtime): void {
    this.selectedShowtimeSubject.next(showtime);
    // Reset seat selection when showtime changes
    this.selectedSeatsSubject.next([]);
  }

  // Calculate total price
  calculateTotal(): number {
    return this.selectedSeatsSubject.value.reduce((total, seat) => total + seat.price, 0);
  }

  // Create booking
  createBooking(movieId: number, movieTitle: string, moviePoster: string): void {
    const user = this.authService.getCurrentUser();
    const selectedShowtime = this.selectedShowtimeSubject.value;
    const selectedSeats = this.selectedSeatsSubject.value;
    
    if (!user || !selectedShowtime || selectedSeats.length === 0) {
      console.error('Cannot create booking: missing user, showtime, or seats');
      return;
    }
    
    const booking: Booking = {
      id: Math.floor(Math.random() * 10000),
      userId: user.id,
      movieId,
      movieTitle,
      moviePoster,
      showtimeId: selectedShowtime.id,
      showtime: `${selectedShowtime.date} ${selectedShowtime.time}`,
      venue: selectedShowtime.venue,
      seats: selectedSeats,
      totalAmount: this.calculateTotal(),
      paymentStatus: 'pending',
      bookingDate: new Date().toISOString()
    };
    
    console.log('Creating new booking:', booking);
    this.bookingSubject.next(booking);
  }

  // Process payment (mock)
  processPayment(): Observable<boolean> {
    return of(true).pipe(
      delay(1500),
      tap(() => {
        const booking = this.bookingSubject.value;
        console.log('Processing payment for booking:', booking);
        
        if (booking) {
          // Update booking with completed status
          const updatedBooking = {
            ...booking,
            paymentStatus: 'completed' as const
          };
          console.log('Payment successful, updating booking:', updatedBooking);
          this.bookingSubject.next(updatedBooking);
        } else {
          console.error('Cannot process payment: no booking found');
        }
      })
    );
  }

  // Reset booking
  resetBooking(): void {
    this.selectedSeatsSubject.next([]);
    this.selectedShowtimeSubject.next(null);
    this.bookingSubject.next(null);
  }

  // Get selected seats
  getSelectedSeats(): Seat[] {
    return this.selectedSeatsSubject.value;
  }

  // Check if a seat is selected
  isSeatSelected(seatId: string): boolean {
    return this.selectedSeatsSubject.value.some(seat => seat.id === seatId);
  }
}