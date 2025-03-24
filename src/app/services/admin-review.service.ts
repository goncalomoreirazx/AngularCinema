import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

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

@Injectable({
  providedIn: 'root'
})
export class AdminReviewService {
  private reviews: Review[] = [
    {
      id: 1,
      movieId: 1,
      movieTitle: 'The Matrix Resurrections',
      userId: 101,
      userName: 'John Doe',
      userAvatar: '/assets/images/avatars/user1.jpg',
      rating: 4.5,
      content: 'The Matrix Resurrections brings back the beloved characters in a new story that both honors the original trilogy and takes the franchise in a fresh direction. The action sequences are as spectacular as ever, and the philosophical themes remain thought-provoking. Keanu Reeves and Carrie-Anne Moss slip back into their iconic roles effortlessly.',
      date: '2023-12-25T14:30:00',
      status: 'approved'
    },
    {
      id: 2,
      movieId: 1,
      movieTitle: 'The Matrix Resurrections',
      userId: 102,
      userName: 'Jane Smith',
      userAvatar: '/assets/images/avatars/user2.jpg',
      rating: 3.5,
      content: 'A nostalgic trip back to the Matrix universe with enough new ideas to justify its existence. The meta commentary on reboots and sequels is clever, and the chemistry between Neo and Trinity remains the emotional heart of the story. Some of the action scenes feel a bit too familiar, but the visual effects are stunning as always.',
      date: '2023-12-24T09:15:00',
      status: 'pending'
    },
    {
      id: 3,
      movieId: 2,
      movieTitle: 'Dune',
      userId: 103,
      userName: 'Mike Johnson',
      userAvatar: '/assets/images/avatars/user3.jpg',
      rating: 5,
      content: 'Denis Villeneuve has created a masterpiece with Dune. The film is a visual spectacle with breathtaking landscapes and incredible attention to detail. The cast delivers stellar performances, especially Timothée Chalamet as Paul Atreides. The story is complex but presented in a way that keeps you engaged throughout. A must-watch for sci-fi fans!',
      date: '2023-10-25T16:45:00',
      status: 'approved'
    },
    {
      id: 4,
      movieId: 2,
      movieTitle: 'Dune',
      userId: 104,
      userName: 'Sarah Williams',
      userAvatar: '/assets/images/avatars/user4.jpg',
      rating: 2,
      content: 'I found Dune to be unnecessarily long and boring. The pacing is slow, and the story drags on with too many unnecessary scenes. The visual effects are good, but they can\'t make up for the lackluster storytelling. I expected more from such a highly-rated film.',
      date: '2023-11-05T10:30:00',
      status: 'rejected'
    }
  ];

  constructor() { }

  getReviews(): Observable<Review[]> {
    return of([...this.reviews]).pipe(delay(800));
  }

  getReviewById(id: number): Observable<Review | undefined> {
    const review = this.reviews.find(r => r.id === id);
    return of(review).pipe(delay(300));
  }

  getReviewsByMovieId(movieId: number): Observable<Review[]> {
    const movieReviews = this.reviews.filter(r => r.movieId === movieId);
    return of(movieReviews).pipe(delay(500));
  }

  addReview(review: Review): Observable<Review> {
    // Assign a new ID (simple implementation for mock service)
    const newId = Math.max(0, ...this.reviews.map(r => r.id)) + 1;
    const newReview = { ...review, id: newId };
    
    this.reviews.push(newReview);
    return of(newReview).pipe(delay(500));
  }

  updateReview(review: Review): Observable<Review> {
    const index = this.reviews.findIndex(r => r.id === review.id);
    
    if (index >= 0) {
      this.reviews[index] = { ...review };
      return of(this.reviews[index]).pipe(delay(500));
    }
    
    throw new Error('Review not found');
  }

  deleteReview(id: number): Observable<boolean> {
    const index = this.reviews.findIndex(r => r.id === id);
    
    if (index >= 0) {
      this.reviews.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    
    return of(false).pipe(delay(500));
  }
}