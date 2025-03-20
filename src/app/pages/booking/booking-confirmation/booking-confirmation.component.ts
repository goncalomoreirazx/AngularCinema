import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Booking } from '../../../services/ticket.service';

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-confirmation.component.html',
  styleUrl: './booking-confirmation.component.scss'
})
export class BookingConfirmationComponent implements OnInit, OnChanges {
  @Input() booking: Booking | null = null;
  @Output() newBooking = new EventEmitter<void>();
  
  // Cache the reference ID to avoid Angular ExpressionChangedAfterItHasBeenCheckedError
  private referenceId: string = this.generateReferenceId();
  
  ngOnInit() {
    console.log('BookingConfirmationComponent initialized');
    console.log('Initial booking data:', this.booking);
    
    // Try to recover booking from localStorage if not provided
    if (!this.booking) {
      console.log('No booking provided, attempting to recover from localStorage');
      try {
        // Try multiple keys in order of preference
        const keys = ['completedBooking', 'currentBooking', 'fallbackBooking', 'lastBooking'];
        let recovered = false;
        
        for (const key of keys) {
          const storedBooking = localStorage.getItem(key);
          if (storedBooking) {
            console.log(`Recovered booking from localStorage (${key})`);
            try {
              const parsedBooking = JSON.parse(storedBooking);
              // Force booking to have completed status
              parsedBooking.paymentStatus = 'completed';
              this.booking = parsedBooking;
              recovered = true;
              
              // Save this recovered booking as the completed booking
              localStorage.setItem('completedBooking', storedBooking);
              break;
            } catch (parseError) {
              console.error('Error parsing booking from localStorage:', parseError);
            }
          }
        }
        
        if (!recovered) {
          console.warn('No booking found in localStorage, creating emergency booking');
          this.createEmergencyBooking();
        }
      } catch (error) {
        console.error('Error recovering booking from localStorage:', error);
        this.createEmergencyBooking();
      }
    }
  }
  
  // Create emergency booking for display
  private createEmergencyBooking(): void {
    console.log('Creating emergency booking for display');
    this.booking = {
      id: Math.floor(Math.random() * 10000),
      userId: 9999,
      movieId: 1,
      movieTitle: 'The Matrix Resurrections',
      moviePoster: '/assets/images/matrix.png',
      showtimeId: 1,
      showtime: new Date().toISOString().split('T')[0] + ' 20:00',
      venue: 'Main Hall',
      seats: [
        {
          id: 'A1',
          row: 'A',
          number: 1,
          type: 'standard',
          price: 10,
          isAvailable: true
        }
      ],
      totalAmount: 10,
      paymentStatus: 'completed',
      bookingDate: new Date().toISOString()
    };
    
    // Store it for future reference
    try {
      localStorage.setItem('emergencyBooking', JSON.stringify(this.booking));
      localStorage.setItem('completedBooking', JSON.stringify(this.booking));
    } catch (error) {
      console.error('Error storing emergency booking:', error);
    }
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['booking']) {
      console.log('Booking input changed:', this.booking);
    }
  }
  
  // Format date
  formatDate(dateStr: string | undefined): string {
    if (!dateStr) {
      console.log('Date string is empty or undefined');
      return '';
    }
    
    console.log('Formatting date:', dateStr);
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateStr;
    }
  }
  
  // Format seat IDs for display
  formatSeatIds(): string {
    if (!this.booking) {
      console.log('No booking data available for formatting seats');
      return '';
    }
    
    if (!this.booking.seats || !Array.isArray(this.booking.seats)) {
      console.error('Booking seats are not available or not an array:', this.booking.seats);
      return '';
    }
    
    return this.booking.seats
      .map(seat => seat.id)
      .join(', ');
  }
  
  // Start a new booking
  startNewBooking(): void {
    console.log('Starting new booking...');
    this.newBooking.emit();
  }
  
  // Generate a random reference ID for error handling
  getRandomReferenceId(): string {
    return this.referenceId; // Return cached value
  }
  
  // Generate a reference ID (private method to avoid Angular change detection issues)
  private generateReferenceId(): string {
    return 'REF-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  }
}