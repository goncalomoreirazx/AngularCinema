// src/app/pages/booking/showtime-selector/showtime-selector.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Showtime } from '../../../services/ticket.service';

@Component({
  selector: 'app-showtime-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './showtime-selector.component.html',
  styleUrl: './showtime-selector.component.scss'
})
export class ShowtimeSelectorComponent {
  @Input() showtimes: Showtime[] = [];
  @Input() selectedShowtime: Showtime | null = null;
  @Output() showtimeSelected = new EventEmitter<Showtime>();
  
  selectedDate: string = '';
  
  // Get unique dates from showtimes
  get uniqueDates(): string[] {
    return [...new Set(this.showtimes.map(s => s.date))];
  }
  
  // Get showtimes for a specific date
  getShowtimesForDate(date: string): Showtime[] {
    return this.showtimes.filter(s => s.date === date);
  }
  
  // Add this missing method
  hasNoShowtimes(venue: string): boolean {
    return this.getShowtimesForDate(this.selectedDate)
      .filter(s => s.venue === venue).length === 0;
  }
  
  // Format date for display
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  }
  
  // Handle date selection
  selectDate(date: string): void {
    this.selectedDate = date;
  }
  
  // Handle showtime selection
  selectShowtime(showtime: Showtime): void {
    this.showtimeSelected.emit(showtime);
  }
  
  // Check if a showtime is selected
  isShowtimeSelected(showtime: Showtime): boolean {
    return this.selectedShowtime?.id === showtime.id;
  }
  
  // Initialize with first date
  ngOnInit(): void {
    if (this.uniqueDates.length > 0) {
      this.selectedDate = this.uniqueDates[0];
    }
  }
}