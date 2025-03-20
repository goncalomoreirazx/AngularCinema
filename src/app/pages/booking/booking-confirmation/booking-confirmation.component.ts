// src/app/pages/booking/booking-confirmation/booking-confirmation.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Booking } from '../../../services/ticket.service';

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-confirmation.component.html',
  styleUrl: './booking-confirmation.component.scss'
})
export class BookingConfirmationComponent {
  @Input() booking: Booking | null = null;
  @Output() newBooking = new EventEmitter<void>();
  
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
  
  // Format seat IDs for display
  formatSeatIds(): string {
    if (!this.booking) return '';
    
    return this.booking.seats
      .map(seat => seat.id)
      .join(', ');
  }
  
  // Start a new booking
  startNewBooking(): void {
    this.newBooking.emit();
  }
}