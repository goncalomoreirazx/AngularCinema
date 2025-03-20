// src/app/pages/booking/ticket-summary/ticket-summary.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Seat, Showtime } from '../../../services/ticket.service';

@Component({
  selector: 'app-ticket-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-summary.component.html',
  styleUrl: './ticket-summary.component.scss'
})
export class TicketSummaryComponent {
  @Input() movie: any;
  @Input() selectedShowtime: Showtime | null = null;
  @Input() selectedSeats: Seat[] = [];
  
  // Calculate total
  get totalAmount(): number {
    return this.selectedSeats.reduce((total, seat) => total + seat.price, 0);
  }
  
  // Format date
  formatDate(dateStr: string | undefined): string {
    if (!dateStr) return '';
    
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
  
  // Get seat type counts
  getSeatTypeCounts(): { [key: string]: { count: number, price: number } } {
    const counts: { [key: string]: { count: number, price: number } } = {};
    
    this.selectedSeats.forEach(seat => {
      if (!counts[seat.type]) {
        counts[seat.type] = { count: 0, price: seat.price };
      }
      counts[seat.type].count++;
    });
    
    return counts;
  }
  
  // Format seat IDs for display
  formatSeatIds(): string {
    return this.selectedSeats
      .map(seat => seat.id)
      .join(', ');
  }
}