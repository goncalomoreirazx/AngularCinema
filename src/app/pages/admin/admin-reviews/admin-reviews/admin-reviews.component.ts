import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminReviewService } from '../../../../services/admin-review.service';

interface Review {
  id: number;
  movieId: number;
  movieTitle: string;
  userId: number;
  userName: string;
  userAvatar: string;
  rating: number;
  content: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reviews.component.html',
  styleUrl: './admin-reviews.component.scss'
})
export class AdminReviewsComponent implements OnInit {
  reviews: Review[] = [];
  filteredReviews: Review[] = [];
  selectedReview: Review | null = null;
  isLoading = true;
  statusFilter: 'all' | 'pending' | 'approved' | 'rejected' = 'all';
  movieFilter = '';
  showDeleteConfirmation = false;
  deleteId: number | null = null;

  constructor(private adminReviewService: AdminReviewService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.isLoading = true;
    this.adminReviewService.getReviews().subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.reviews];
    
    // Apply status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(review => review.status === this.statusFilter);
    }
    
    // Apply movie title filter
    if (this.movieFilter) {
      const searchTerm = this.movieFilter.toLowerCase();
      filtered = filtered.filter(review => 
        review.movieTitle.toLowerCase().includes(searchTerm));
    }
    
    this.filteredReviews = filtered;
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  onMovieFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.statusFilter = 'all';
    this.movieFilter = '';
    this.applyFilters();
  }

  viewReview(review: Review): void {
    this.selectedReview = review;
  }

  closeReviewDetails(): void {
    this.selectedReview = null;
  }

  confirmDelete(id: number): void {
    this.deleteId = id;
    this.showDeleteConfirmation = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
    this.deleteId = null;
  }

  deleteReview(): void {
    if (this.deleteId) {
      this.adminReviewService.deleteReview(this.deleteId).subscribe({
        next: () => {
          this.loadReviews();
          this.showDeleteConfirmation = false;
          this.deleteId = null;
          if (this.selectedReview && this.selectedReview.id === this.deleteId) {
            this.selectedReview = null;
          }
        },
        error: (error) => {
          console.error('Error deleting review:', error);
        }
      });
    }
  }

  updateReviewStatus(review: Review, status: 'pending' | 'approved' | 'rejected'): void {
    const updatedReview = { ...review, status };
    
    this.adminReviewService.updateReview(updatedReview).subscribe({
      next: () => {
        this.loadReviews();
        if (this.selectedReview && this.selectedReview.id === review.id) {
          this.selectedReview = updatedReview;
        }
      },
      error: (error) => {
        console.error('Error updating review status:', error);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'Pending Review';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  }

  getRatingStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '';
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars += '★';
    }
    
    // Add half star if needed
    if (halfStar) {
      stars += '⭐';
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars += '☆';
    }
    
    return stars;
  }
}