// src/app/pages/booking/payment/payment.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService, Booking } from '../../../services/ticket.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {
  @Input() booking: Booking | null = null;
  @Output() paymentComplete = new EventEmitter<void>();
  
  cardNumber: string = '';
  cardHolder: string = '';
  expiryDate: string = '';
  cvv: string = '';
  
  isProcessing: boolean = false;
  paymentError: string = '';
  
  constructor(private ticketService: TicketService) {}
  
  // Process payment
  processPayment(): void {
    console.log('Processing payment...');
    // Simple validation
    if (!this.cardNumber || !this.cardHolder || !this.expiryDate || !this.cvv) {
      this.paymentError = 'Please fill in all payment details';
      return;
    }
    
    // Basic card number validation (just check length)
    if (this.cardNumber.replace(/\s/g, '').length !== 16) {
      this.paymentError = 'Invalid card number';
      return;
    }
    
    this.isProcessing = true;
    this.paymentError = '';
    
    // Call service to process payment
    this.ticketService.processPayment().subscribe(
      success => {
        console.log('Payment processed:', success);
        if (success) {
          console.log('Payment successful, emitting completion event');
          this.paymentComplete.emit();
        } else {
          this.paymentError = 'Payment processing failed. Please try again.';
        }
      }
    );
  }
}