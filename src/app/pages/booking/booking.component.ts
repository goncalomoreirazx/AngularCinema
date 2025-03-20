// src/app/pages/booking/booking.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TicketService, Seat, Showtime, Booking } from '../../services/ticket.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { SeatMapComponent } from './seat-map/seat-map.component';
import { ShowtimeSelectorComponent } from './showtime-selector/showtime-selector.component';
import { TicketSummaryComponent } from './ticket-summary/ticket-summary.component';
import { PaymentComponent } from './payment/payment.component';
import { BookingConfirmationComponent } from './booking-confirmation/booking-confirmation.component';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent,
    SeatMapComponent,
    ShowtimeSelectorComponent,
    TicketSummaryComponent,
    PaymentComponent,
    BookingConfirmationComponent
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent implements OnInit, OnDestroy {
  movieId: number = 0;
  movie: any = null;
  currentStep = 1;
  totalSteps = 4;
  showtimes: Showtime[] = [];
  seatMap: Seat[] = [];
  selectedShowtime: Showtime | null = null;
  selectedSeats: Seat[] = [];
  booking: Booking | null = null;
  bookingComplete = false;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    // Get movie ID from route params
    this.route.params.subscribe(params => {
      this.movieId = +params['id'];
      this.loadMovieDetails();
      this.showtimes = this.ticketService.getShowtimesByMovie(this.movieId);
    });

    // Subscribe to selected showtime changes
    this.subscriptions.push(
      this.ticketService.selectedShowtime$.subscribe(showtime => {
        this.selectedShowtime = showtime;
        if (showtime) {
          this.seatMap = this.ticketService.generateSeatMap(showtime.id);
        }
      })
    );

    // Subscribe to selected seats changes
    this.subscriptions.push(
      this.ticketService.selectedSeats$.subscribe(seats => {
        this.selectedSeats = seats;
      })
    );

    // Subscribe to booking changes
    this.subscriptions.push(
      this.ticketService.booking$.subscribe(booking => {
        this.booking = booking;
        // Very important: This sets the bookingComplete flag when payment is completed
        if (booking && booking.paymentStatus === 'completed') {
          this.bookingComplete = true;
          console.log('Booking complete!', booking);
        }
      })
    );
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
    // Reset booking state when component is destroyed
    this.ticketService.resetBooking();
  }

  loadMovieDetails(): void {
    // Mock movie data - in a real app this would come from a service
    this.movie = {
      id: this.movieId,
      title: 'The Matrix Resurrections',
      posterUrl: '/assets/images/matrix.png',
      duration: '2h 28m',
      releaseDate: '2023-12-22',
      genre: 'Action, Sci-Fi'
    };
  }

  nextStep(): void {
    console.log('Next step clicked, current step:', this.currentStep);
    
    // Validation for each step
    if (this.currentStep === 1 && !this.selectedShowtime) {
      console.log('Cannot proceed: no showtime selected');
      return; // Cannot proceed without selecting a showtime
    }
    
    if (this.currentStep === 2 && this.selectedSeats.length === 0) {
      console.log('Cannot proceed: no seats selected');
      return; // Cannot proceed without selecting seats
    }
    
    if (this.currentStep === 3) {
      // Create booking
      console.log('Creating booking for movie:', this.movie);
      console.log('Selected showtime:', this.selectedShowtime);
      console.log('Selected seats:', this.selectedSeats);
      
      this.ticketService.createBooking(this.movieId, this.movie.title, this.movie.posterUrl);
      
      // Verify booking was created
      if (!this.booking) {
        console.error('Failed to create booking!');
        return;
      } else {
        console.log('Booking created successfully:', this.booking);
      }
    }
  
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onShowtimeSelected(showtime: Showtime): void {
    this.ticketService.selectShowtime(showtime);
  }

  onSeatSelected(seat: Seat): void {
    this.ticketService.selectSeat(seat);
  }

  onPaymentComplete(): void {
    this.currentStep++;
  }

  startNewBooking(): void {
    console.log('Starting new booking');
    this.ticketService.resetBooking();
    this.router.navigate(['/movies']);
  }
}