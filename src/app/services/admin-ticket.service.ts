import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Ticket {
  id: number;
  bookingId: number;
  userId: number;
  userName: string;
  userEmail: string;
  movieId: number;
  movieTitle: string;
  posterUrl: string;
  showtime: string;
  venue: string;
  seats: string[];
  totalAmount: number;
  paymentMethod: string;
  status: 'active' | 'used' | 'canceled' | 'refunded';
  bookingDate: string;
  lastUpdated?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminTicketService {
  private tickets: Ticket[] = [
    {
      id: 1001,
      bookingId: 5001,
      userId: 101,
      userName: 'John Doe',
      userEmail: 'john.doe@example.com',
      movieId: 1,
      movieTitle: 'The Matrix Resurrections',
      posterUrl: '/assets/images/matrix.png',
      showtime: '2025-03-26 19:15',
      venue: 'IMAX Experience',
      seats: ['G10', 'G11'],
      totalAmount: 33.98,
      paymentMethod: 'Credit Card',
      status: 'active',
      bookingDate: '2025-03-20T14:30:25'
    },
    {
      id: 1002,
      bookingId: 5002,
      userId: 102,
      userName: 'Jane Smith',
      userEmail: 'jane.smith@example.com',
      movieId: 2,
      movieTitle: 'Dune',
      posterUrl: '/assets/images/dune.jpeg',
      showtime: '2025-03-26 16:00',
      venue: 'Premium Screen',
      seats: ['D5', 'D6', 'D7'],
      totalAmount: 44.97,
      paymentMethod: 'PayPal',
      status: 'active',
      bookingDate: '2025-03-19T10:15:42'
    },
    {
      id: 1003,
      bookingId: 5003,
      userId: 103,
      userName: 'Mike Johnson',
      userEmail: 'mike.johnson@example.com',
      movieId: 1,
      movieTitle: 'The Matrix Resurrections',
      posterUrl: '/assets/images/matrix.png',
      showtime: '2025-03-25 20:00',
      venue: 'Main Hall',
      seats: ['B12'],
      totalAmount: 12.99,
      paymentMethod: 'Credit Card',
      status: 'used',
      bookingDate: '2025-03-18T09:45:30',
      lastUpdated: '2025-03-25T20:10:15'
    },
    {
      id: 1004,
      bookingId: 5004,
      userId: 104,
      userName: 'Sarah Williams',
      userEmail: 'sarah.williams@example.com',
      movieId: 2,
      movieTitle: 'Dune',
      posterUrl: '/assets/images/dune.jpeg',
      showtime: '2025-03-24 15:30',
      venue: 'Main Hall',
      seats: ['H8', 'H9'],
      totalAmount: 25.98,
      paymentMethod: 'PayPal',
      status: 'canceled',
      bookingDate: '2025-03-17T18:30:00',
      lastUpdated: '2025-03-18T09:15:22'
    },
    {
      id: 1005,
      bookingId: 5005,
      userId: 105,
      userName: 'Robert Brown',
      userEmail: 'robert.brown@example.com',
      movieId: 3,
      movieTitle: 'Spider-Man: No Way Home',
      posterUrl: '/assets/images/spiderman.jpg',
      showtime: '2025-03-27 14:00',
      venue: 'IMAX Experience',
      seats: ['F4', 'F5', 'F6', 'F7'],
      totalAmount: 67.96,
      paymentMethod: 'Credit Card',
      status: 'refunded',
      bookingDate: '2025-03-20T11:25:18',
      lastUpdated: '2025-03-21T15:40:52'
    },
    {
      id: 1006,
      bookingId: 5006,
      userId: 106,
      userName: 'Emma Davis',
      userEmail: 'emma.davis@example.com',
      movieId: 4,
      movieTitle: 'The Batman',
      posterUrl: '/assets/images/batman.jpg',
      showtime: '2025-03-28 18:30',
      venue: 'Premium Screen',
      seats: ['C15'],
      totalAmount: 14.99,
      paymentMethod: 'PayPal',
      status: 'active',
      bookingDate: '2025-03-22T16:45:10'
    }
  ];

  constructor() { }

  getTickets(): Observable<Ticket[]> {
    return of([...this.tickets]).pipe(delay(800));
  }

  getTicketById(id: number): Observable<Ticket | undefined> {
    const ticket = this.tickets.find(t => t.id === id);
    return of(ticket).pipe(delay(300));
  }

  getTicketsByUserId(userId: number): Observable<Ticket[]> {
    const userTickets = this.tickets.filter(t => t.userId === userId);
    return of(userTickets).pipe(delay(500));
  }

  getTicketsByMovieId(movieId: number): Observable<Ticket[]> {
    const movieTickets = this.tickets.filter(t => t.movieId === movieId);
    return of(movieTickets).pipe(delay(500));
  }

  getTicketsByStatus(status: 'active' | 'used' | 'canceled' | 'refunded'): Observable<Ticket[]> {
    const statusTickets = this.tickets.filter(t => t.status === status);
    return of(statusTickets).pipe(delay(500));
  }

  updateTicketStatus(id: number, status: 'active' | 'used' | 'canceled' | 'refunded'): Observable<Ticket | undefined> {
    const index = this.tickets.findIndex(t => t.id === id);
    
    if (index >= 0) {
      this.tickets[index] = {
        ...this.tickets[index],
        status,
        lastUpdated: new Date().toISOString()
      };
      return of(this.tickets[index]).pipe(delay(500));
    }
    
    return of(undefined).pipe(delay(500));
  }

  deleteTicket(id: number): Observable<boolean> {
    const index = this.tickets.findIndex(t => t.id === id);
    
    if (index >= 0) {
      this.tickets.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    
    return of(false).pipe(delay(500));
  }

  // Generate a receipt for a ticket
  generateReceipt(id: number): Observable<string> {
    const ticket = this.tickets.find(t => t.id === id);
    
    if (!ticket) {
      return of('Ticket not found').pipe(delay(300));
    }
    
    // In a real application, you would generate a PDF or HTML receipt
    const receiptUrl = `/receipts/ticket-${id}.pdf`;
    
    return of(receiptUrl).pipe(delay(800));
  }

  // Refund a ticket
  refundTicket(id: number): Observable<Ticket | undefined> {
    return this.updateTicketStatus(id, 'refunded');
  }

  // Resend a ticket confirmation email
  resendConfirmation(id: number): Observable<boolean> {
    const ticket = this.tickets.find(t => t.id === id);
    
    if (!ticket) {
      return of(false).pipe(delay(300));
    }
    
    // In a real application, you would send an email
    return of(true).pipe(delay(800));
  }
}