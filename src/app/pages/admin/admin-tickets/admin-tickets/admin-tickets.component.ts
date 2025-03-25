import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminTicketService, Ticket } from '../../../../services/admin-ticket-service';

@Component({
  selector: 'app-admin-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-tickets.component.html',
  styleUrl: './admin-tickets.component.scss'
})
export class AdminTicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  selectedTicket: Ticket | null = null;
  isLoading = true;
  statusFilter: 'all' | 'active' | 'used' | 'canceled' | 'refunded' = 'all';
  movieFilter = '';
  dateFilter = '';
  userFilter = '';
  showDeleteConfirmation = false;
  showRefundConfirmation = false;
  deleteId: number | null = null;
  refundId: number | null = null;
  actionMessage = { text: '', type: '' };
  isActionInProgress = false;

  constructor(private adminTicketService: AdminTicketService) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.isLoading = true;
    this.adminTicketService.getTickets().subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tickets:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.tickets];
    
    // Apply status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === this.statusFilter);
    }
    
    // Apply movie title filter
    if (this.movieFilter) {
      const searchTerm = this.movieFilter.toLowerCase();
      filtered = filtered.filter(ticket => 
        ticket.movieTitle.toLowerCase().includes(searchTerm));
    }
    
    // Apply date filter
    if (this.dateFilter) {
      filtered = filtered.filter(ticket => 
        ticket.showtime.includes(this.dateFilter));
    }
    
    // Apply user filter
    if (this.userFilter) {
      const searchTerm = this.userFilter.toLowerCase();
      filtered = filtered.filter(ticket => 
        ticket.userName.toLowerCase().includes(searchTerm) ||
        ticket.userEmail.toLowerCase().includes(searchTerm));
    }
    
    this.filteredTickets = filtered;
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  onMovieFilterChange(): void {
    this.applyFilters();
  }

  onDateFilterChange(): void {
    this.applyFilters();
  }

  onUserFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.statusFilter = 'all';
    this.movieFilter = '';
    this.dateFilter = '';
    this.userFilter = '';
    this.applyFilters();
  }

  viewTicket(ticket: Ticket): void {
    this.selectedTicket = ticket;
  }

  closeTicketDetails(): void {
    this.selectedTicket = null;
  }

  confirmDelete(id: number): void {
    this.deleteId = id;
    this.showDeleteConfirmation = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
    this.deleteId = null;
  }

  deleteTicket(): void {
    if (this.deleteId) {
      this.isActionInProgress = true;
      this.adminTicketService.deleteTicket(this.deleteId).subscribe({
        next: () => {
          this.loadTickets();
          this.showDeleteConfirmation = false;
          this.deleteId = null;
          this.actionMessage = { text: 'Ticket successfully deleted', type: 'success' };
          this.isActionInProgress = false;
          if (this.selectedTicket && this.selectedTicket.id === this.deleteId) {
            this.selectedTicket = null;
          }
          setTimeout(() => this.actionMessage = { text: '', type: '' }, 3000);
        },
        error: (error) => {
          console.error('Error deleting ticket:', error);
          this.actionMessage = { text: 'Error deleting ticket', type: 'error' };
          this.isActionInProgress = false;
          setTimeout(() => this.actionMessage = { text: '', type: '' }, 3000);
        }
      });
    }
  }

  confirmRefund(id: number): void {
    this.refundId = id;
    this.showRefundConfirmation = true;
  }

  cancelRefund(): void {
    this.showRefundConfirmation = false;
    this.refundId = null;
  }

  refundTicket(): void {
    if (this.refundId) {
      this.isActionInProgress = true;
      this.adminTicketService.refundTicket(this.refundId).subscribe({
        next: (ticket) => {
          this.loadTickets();
          this.showRefundConfirmation = false;
          this.refundId = null;
          this.actionMessage = { text: 'Ticket successfully refunded', type: 'success' };
          this.isActionInProgress = false;
          if (this.selectedTicket && this.selectedTicket.id === this.refundId) {
            this.selectedTicket = ticket || null;
          }
          setTimeout(() => this.actionMessage = { text: '', type: '' }, 3000);
        },
        error: (error) => {
          console.error('Error refunding ticket:', error);
          this.actionMessage = { text: 'Error refunding ticket', type: 'error' };
          this.isActionInProgress = false;
          setTimeout(() => this.actionMessage = { text: '', type: '' }, 3000);
        }
      });
    }
  }

  updateTicketStatus(id: number, status: 'active' | 'used' | 'canceled' | 'refunded'): void {
    this.isActionInProgress = true;
    this.adminTicketService.updateTicketStatus(id, status).subscribe({
      next: (ticket) => {
        this.loadTickets();
        this.actionMessage = { text: `Ticket status updated to ${status}`, type: 'success' };
        this.isActionInProgress = false;
        if (this.selectedTicket && this.selectedTicket.id === id) {
          this.selectedTicket = ticket || null;
        }
        setTimeout(() => this.actionMessage = { text: '', type: '' }, 3000);
      },
      error: (error) => {
        console.error('Error updating ticket status:', error);
        this.actionMessage = { text: 'Error updating ticket status', type: 'error' };
        this.isActionInProgress = false;
        setTimeout(() => this.actionMessage = { text: '', type: '' }, 3000);
      }
    });
  }

  resendConfirmation(id: number): void {
    this.isActionInProgress = true;
    this.adminTicketService.resendConfirmation(id).subscribe({
      next: (success) => {
        if (success) {
          this.actionMessage = { text: 'Confirmation email resent successfully', type: 'success' };
        } else {
          this.actionMessage = { text: 'Failed to resend confirmation email', type: 'error' };
        }
        this.isActionInProgress = false;
        setTimeout(() => this.actionMessage = { text: '', type: '' }, 3000);
      },
      error: (error) => {
        console.error('Error resending confirmation:', error);
        this.actionMessage = { text: 'Error resending confirmation email', type: 'error' };
        this.isActionInProgress = false;
        setTimeout(() => this.actionMessage = { text: '', type: '' }, 3000);
      }
    });
  }

  generateReceipt(id: number): void {
    this.isActionInProgress = true;
    this.adminTicketService.generateReceipt(id).subscribe({
      next: (receiptUrl) => {
        // In a real application, you would either open the URL or download the receipt
        console.log('Receipt generated:', receiptUrl);
        this.actionMessage = { text: 'Receipt generated successfully', type: 'success' };
        this.isActionInProgress = false;
        setTimeout(() => this.actionMessage = { text: '', type: '' }, 3000);
      },
      error: (error) => {
        console.error('Error generating receipt:', error);
        this.actionMessage = { text: 'Error generating receipt', type: 'error' };
        this.isActionInProgress = false;
        setTimeout(() => this.actionMessage = { text: '', type: '' }, 3000);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatShowtime(showtimeString: string): string {
    // Format "YYYY-MM-DD HH:MM" to more readable form
    if (!showtimeString) return '';
    
    const [datePart, timePart] = showtimeString.split(' ');
    const date = new Date(datePart + 'T' + timePart);
    
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active': return 'Active';
      case 'used': return 'Used';
      case 'canceled': return 'Canceled';
      case 'refunded': return 'Refunded';
      default: return status;
    }
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }
}