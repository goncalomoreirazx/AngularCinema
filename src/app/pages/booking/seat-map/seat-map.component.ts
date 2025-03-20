// src/app/pages/booking/seat-map/seat-map.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService, Seat } from '../../../services/ticket.service';

@Component({
  selector: 'app-seat-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat-map.component.html',
  styleUrl: './seat-map.component.scss'
})
export class SeatMapComponent {
  @Input() seatMap: Seat[] = [];
  @Output() seatSelected = new EventEmitter<Seat>();
  
  constructor(public ticketService: TicketService) {}
  
  // Get seats for a specific row
  getSeatsForRow(row: string): Seat[] {
    return this.seatMap.filter(seat => seat.row === row);
  }
  
  // Get unique rows
  get uniqueRows(): string[] {
    return [...new Set(this.seatMap.map(seat => seat.row))];
  }
  
  // Check if a seat is selected
  isSeatSelected(seatId: string): boolean {
    return this.ticketService.isSeatSelected(seatId);
  }
  
  // Handle seat selection
  onSeatClick(seat: Seat): void {
    if (!seat.isAvailable) return;
    
    this.seatSelected.emit(seat);
  }
  
  // Get class for seat
  getSeatClass(seat: Seat): string {
    let classes = `seat seat-${seat.type}`;
    
    if (!seat.isAvailable) {
      classes += ' seat-unavailable';
    } else if (this.isSeatSelected(seat.id)) {
      classes += ' seat-selected';
    }
    
    return classes;
  }
  
  // Add these methods to access TicketService from the template
  getSelectedSeats(): Seat[] {
    return this.ticketService.getSelectedSeats();
  }
  
  hasSelectedSeats(): boolean {
    return this.getSelectedSeats().length > 0;
  }
}