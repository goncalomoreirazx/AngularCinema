import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Cast {
  id: number;
  name: string;
  character: string;
  photoUrl: string;
}

interface SimilarMovie {
  id: number;
  title: string;
  posterUrl: string;
}

interface TimeSlot {
  time: string;
  format: string;
}

interface Venue {
  id: number;
  name: string;
  timeSlots: TimeSlot[];
}

interface Review {
  id: number;
  reviewerName: string;
  avatarUrl: string;
  date: string;
  rating: number;
  content: string;
  expanded: boolean;
}

interface Movie {
  id: number;
  title: string;
  tagline: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  trailerThumbnail: string;
  releaseDate: string;
  runtime: number;
  rating: number;
  genres: string[];
  director: string;
  writer: string;
  studio: string;
  language: string;
  ageRating: string;
  budget: number;
  boxOffice: number;
  cast: Cast[];
}

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss'
})
export class MovieDetailsComponent implements OnInit {
  movieId: number = 0;
  showTrailer: boolean = false;
  safeTrailerUrl: SafeResourceUrl = '';
  selectedDateIndex: number = 0;
  
  // Mock data (would normally come from a service)
  movie: Movie = {
    id: 1,
    title: 'The Matrix Resurrections',
    tagline: 'Return to the source.',
    overview: 'Return to a world of two realities: one, everyday life; the other, what lies behind it. To find out if his reality is a physical or mental construct, Mr. Anderson, aka Neo, will have to choose to follow the white rabbit once more. If he\'s learned anything, it\'s that choice, while an illusion, is still the only way out of—or into—the Matrix. Of course, Neo already knows what he has to do. But what he doesn\'t yet know is the Matrix is stronger, more secure and more dangerous than ever before.',
    posterUrl: '/assets/images/matrix.png',
    backdropUrl: '/assets/images/matrix-backdrop.jpg',
    trailerUrl: 'https://www.youtube.com/embed/9ix7TUGVYIo',
    trailerThumbnail: '/assets/images/matrix.png',
    releaseDate: '2023-12-22',
    runtime: 148,
    rating: 6.8,
    genres: ['Action', 'Sci-Fi', 'Adventure'],
    director: 'Lana Wachowski',
    writer: 'Lana Wachowski, David Mitchell, Aleksandar Hemon',
    studio: 'Warner Bros. Pictures',
    language: 'English',
    ageRating: 'R',
    budget: 190000000,
    boxOffice: 157700000,
    cast: [
      {
        id: 1,
        name: 'Keanu Reeves',
        character: 'Neo',
        photoUrl: '/assets/images/cast/keanu.jpg'
      },
      {
        id: 2,
        name: 'Carrie-Anne Moss',
        character: 'Trinity',
        photoUrl: '/assets/images/cast/carrie.jpg'
      },
      {
        id: 3,
        name: 'Yahya Abdul-Mateen II',
        character: 'Morpheus',
        photoUrl: '/assets/images/cast/yahya.jpg'
      },
      {
        id: 4,
        name: 'Jessica Henwick',
        character: 'Bugs',
        photoUrl: '/assets/images/cast/jessica.jpg'
      },
      {
        id: 5,
        name: 'Jonathan Groff',
        character: 'Smith',
        photoUrl: '/assets/images/cast/jonathan.jpg'
      },
      {
        id: 6,
        name: 'Neil Patrick Harris',
        character: 'The Analyst',
        photoUrl: '/assets/images/cast/neil.jpg'
      }
    ]
  };

  similarMovies: SimilarMovie[] = [
    {
      id: 2,
      title: 'The Matrix',
      posterUrl: '/assets/images/matrix.png'
    },
    {
      id: 3,
      title: 'The Matrix Reloaded',
      posterUrl: '/assets/images/similar/matrix.jpg'
    },
    {
      id: 4,
      title: 'The Matrix Revolutions',
      posterUrl: '/assets/images/similar/matrix.jpg'
    },
    {
      id: 5,
      title: 'Inception',
      posterUrl: '/assets/images/similar/inception.jpg'
    },
    {
      id: 6,
      title: 'Tenet',
      posterUrl: '/assets/images/similar/tenet.jpg'
    },
    {
      id: 7,
      title: 'Blade Runner 2049',
      posterUrl: '/assets/images/similar/bladerunner.jpg'
    }
  ];

  // Generate 7 days from today for showtimes
  showDates: Date[] = Array(7).fill(0).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  venues: Venue[] = [
    {
      id: 1,
      name: 'AngularCinema Main Hall',
      timeSlots: [
        { time: '10:30 AM', format: 'Standard' },
        { time: '1:45 PM', format: 'IMAX' },
        { time: '4:30 PM', format: 'Standard' },
        { time: '7:15 PM', format: 'IMAX' },
        { time: '10:00 PM', format: 'Standard' }
      ]
    },
    {
      id: 2,
      name: 'AngularCinema Premium',
      timeSlots: [
        { time: '11:15 AM', format: 'Dolby Atmos' },
        { time: '2:30 PM', format: 'Dolby Atmos' },
        { time: '5:45 PM', format: 'Dolby Atmos' },
        { time: '9:00 PM', format: 'Dolby Atmos' }
      ]
    }
  ];

  reviews: Review[] = [
    {
      id: 1,
      reviewerName: 'John Doe',
      avatarUrl: '/assets/images/avatars/user1.jpg',
      date: '2023-12-25',
      rating: 8,
      content: 'The Matrix Resurrections brings back the beloved characters in a new story that both honors the original trilogy and takes the franchise in a fresh direction. The action sequences are as spectacular as ever, and the philosophical themes remain thought-provoking. Keanu Reeves and Carrie-Anne Moss slip back into their iconic roles effortlessly, and the new additions to the cast are excellent. While it may not reach the heights of the original film, it\'s a worthy continuation that fans will appreciate.',
      expanded: false
    },
    {
      id: 2,
      reviewerName: 'Jane Smith',
      avatarUrl: '/assets/images/avatars/user2.jpg',
      date: '2023-12-24',
      rating: 7,
      content: 'A nostalgic trip back to the Matrix universe with enough new ideas to justify its existence. The meta commentary on reboots and sequels is clever, and the chemistry between Neo and Trinity remains the emotional heart of the story. Some of the action scenes feel a bit too familiar, but the visual effects are stunning as always. The new Morpheus character brings an interesting twist, though longtime fans might miss the original. Overall, it\'s an entertaining addition to the franchise that doesn\'t quite match the revolutionary impact of the original but still delivers a satisfying experience.',
      expanded: false
    },
    {
      id: 3,
      reviewerName: 'Mike Johnson',
      avatarUrl: '/assets/images/avatars/user3.jpg',
      date: '2023-12-23',
      rating: 6,
      content: 'The Matrix Resurrections tries to recapture the magic of the original but falls short in several areas. While the performances are solid and there are some interesting ideas about the nature of the Matrix, the execution feels muddled at times. The action sequences, once the hallmark of the franchise, seem less innovative than what we\'ve come to expect. There\'s still plenty to enjoy for fans, especially the return of Neo and Trinity, but newcomers might find themselves confused by the convoluted plot and numerous references to the previous films.',
      expanded: false
    },
    {
      id: 4,
      reviewerName: 'Sarah Williams',
      avatarUrl: '/assets/images/avatars/user4.jpg',
      date: '2023-12-26',
      rating: 9,
      content: 'A brilliant reimagining of the Matrix concept for a new era. Lana Wachowski has crafted a film thats both a love letter to fans and a commentary on how franchises and their meaning evolve over time. The way the film addresses nostalgia and legacy is particularly powerful. The action is sleek and stylish, with some truly innovative sequences that push the boundaries of what weve seen before. The performances are excellent across the board, with Reeves and Moss bringing new depth to their iconic characters. A spectacular return to a world that still has plenty of stories to tell.',
      expanded: false
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Get movie ID from route parameters
    this.route.params.subscribe(params => {
      this.movieId = +params['id'];
      // In a real app, you would fetch the movie data here
      this.loadMovieDetails();
    });

    // Sanitize trailer URL for safe embedding
    this.safeTrailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.movie.trailerUrl);
  }

  loadMovieDetails(): void {
    // In a real app, this would make an API call
    console.log(`Loading details for movie ID: ${this.movieId}`);
    // this.movieService.getMovieDetails(this.movieId).subscribe(data => {
    //   this.movie = data;
    //   this.safeTrailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.movie.trailerUrl);
    // });
  }

  toggleTrailer(): void {
    this.showTrailer = !this.showTrailer;
  } 

  selectDate(index: number): void {
    this.selectedDateIndex = index;
    // In a real app, this would fetch new showtimes for the selected date
    console.log(`Selected date: ${this.showDates[index].toDateString()}`);
  }

  toggleReviewExpand(review: Review): void {
    review.expanded = !review.expanded;
  }
}