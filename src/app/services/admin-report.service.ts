import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface SalesReport {
  id: number;
  period: string;
  startDate: string;
  endDate: string;
  totalRevenue: number;
  ticketsSold: number;
  averageTicketPrice: number;
  topMovies: {
    movieId: number;
    title: string;
    revenue: number;
    ticketsSold: number;
  }[];
  revenueByDay: {
    date: string;
    revenue: number;
    ticketsSold: number;
  }[];
}

export interface MoviePerformanceReport {
  id: number;
  movieId: number;
  title: string;
  posterUrl: string;
  releaseDate: string;
  totalRevenue: number;
  ticketsSold: number;
  occupancyRate: number;
  averageRating: number;
  performanceByDay: {
    date: string;
    revenue: number;
    ticketsSold: number;
    occupancyRate: number;
  }[];
}

export interface UserActivityReport {
  id: number;
  period: string;
  startDate: string;
  endDate: string;
  totalActiveUsers: number;
  newUsers: number;
  returningUsers: number;
  usersByDay: {
    date: string;
    activeUsers: number;
    newUsers: number;
  }[];
  topUsersByBookings: {
    userId: number;
    username: string;
    bookings: number;
    totalSpent: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminReportService {
  // Mock sales report data
  private salesReports: SalesReport[] = [
    {
      id: 1,
      period: 'Last 7 days',
      startDate: '2025-03-18',
      endDate: '2025-03-24',
      totalRevenue: 28750.50,
      ticketsSold: 2134,
      averageTicketPrice: 13.47,
      topMovies: [
        {
          movieId: 1,
          title: 'The Matrix Resurrections',
          revenue: 9826.50,
          ticketsSold: 722
        },
        {
          movieId: 2,
          title: 'Dune',
          revenue: 7215.25,
          ticketsSold: 535
        },
        {
          movieId: 3,
          title: 'Spider-Man: No Way Home',
          revenue: 6840.75,
          ticketsSold: 507
        }
      ],
      revenueByDay: [
        {
          date: '2025-03-18',
          revenue: 3245.75,
          ticketsSold: 241
        },
        {
          date: '2025-03-19',
          revenue: 3125.50,
          ticketsSold: 232
        },
        {
          date: '2025-03-20',
          revenue: 3450.25,
          ticketsSold: 256
        },
        {
          date: '2025-03-21',
          revenue: 4870.00,
          ticketsSold: 361
        },
        {
          date: '2025-03-22',
          revenue: 5320.50,
          ticketsSold: 394
        },
        {
          date: '2025-03-23',
          revenue: 5210.75,
          ticketsSold: 386
        },
        {
          date: '2025-03-24',
          revenue: 3527.75,
          ticketsSold: 264
        }
      ]
    },
    {
      id: 2,
      period: 'Last 30 days',
      startDate: '2025-02-23',
      endDate: '2025-03-24',
      totalRevenue: 112540.75,
      ticketsSold: 8357,
      averageTicketPrice: 13.47,
      topMovies: [
        {
          movieId: 1,
          title: 'The Matrix Resurrections',
          revenue: 38450.25,
          ticketsSold: 2852
        },
        {
          movieId: 2,
          title: 'Dune',
          revenue: 28320.50,
          ticketsSold: 2101
        },
        {
          movieId: 3,
          title: 'Spider-Man: No Way Home',
          revenue: 26420.75,
          ticketsSold: 1961
        }
      ],
      revenueByDay: [
        // Simplified for brevity - in a real app, this would have 30 entries
        {
          date: '2025-02-23',
          revenue: 3650.25,
          ticketsSold: 271
        },
        {
          date: '2025-03-01',
          revenue: 3850.75,
          ticketsSold: 286
        },
        {
          date: '2025-03-08',
          revenue: 4210.50,
          ticketsSold: 312
        },
        {
          date: '2025-03-15',
          revenue: 4780.25,
          ticketsSold: 355
        },
        {
          date: '2025-03-22',
          revenue: 5320.50,
          ticketsSold: 394
        }
      ]
    }
  ];

  // Mock movie performance reports
  private movieReports: MoviePerformanceReport[] = [
    {
      id: 1,
      movieId: 1,
      title: 'The Matrix Resurrections',
      posterUrl: '/assets/images/matrix.png',
      releaseDate: '2023-12-22',
      totalRevenue: 38450.25,
      ticketsSold: 2852,
      occupancyRate: 78.5,
      averageRating: 4.3,
      performanceByDay: [
        {
          date: '2025-03-18',
          revenue: 1245.75,
          ticketsSold: 92,
          occupancyRate: 76.8
        },
        {
          date: '2025-03-19',
          revenue: 1325.50,
          ticketsSold: 98,
          occupancyRate: 81.2
        },
        {
          date: '2025-03-20',
          revenue: 1450.25,
          ticketsSold: 107,
          occupancyRate: 80.5
        },
        {
          date: '2025-03-21',
          revenue: 1570.00,
          ticketsSold: 116,
          occupancyRate: 87.3
        },
        {
          date: '2025-03-22',
          revenue: 1620.50,
          ticketsSold: 120,
          occupancyRate: 90.2
        },
        {
          date: '2025-03-23',
          revenue: 1410.75,
          ticketsSold: 104,
          occupancyRate: 78.5
        },
        {
          date: '2025-03-24',
          revenue: 1205.50,
          ticketsSold: 89,
          occupancyRate: 74.8
        }
      ]
    },
    {
      id: 2,
      movieId: 2,
      title: 'Dune',
      posterUrl: '/assets/images/dune.jpeg',
      releaseDate: '2023-10-22',
      totalRevenue: 28320.50,
      ticketsSold: 2101,
      occupancyRate: 68.2,
      averageRating: 4.7,
      performanceByDay: [
        {
          date: '2025-03-18',
          revenue: 945.75,
          ticketsSold: 70,
          occupancyRate: 66.8
        },
        {
          date: '2025-03-19',
          revenue: 985.50,
          ticketsSold: 73,
          occupancyRate: 71.2
        },
        {
          date: '2025-03-20',
          revenue: 1010.25,
          ticketsSold: 75,
          occupancyRate: 70.5
        },
        {
          date: '2025-03-21',
          revenue: 1215.00,
          ticketsSold: 90,
          occupancyRate: 77.3
        },
        {
          date: '2025-03-22',
          revenue: 1350.50,
          ticketsSold: 100,
          occupancyRate: 80.2
        },
        {
          date: '2025-03-23',
          revenue: 1080.75,
          ticketsSold: 80,
          occupancyRate: 68.5
        },
        {
          date: '2025-03-24',
          revenue: 945.50,
          ticketsSold: 70,
          occupancyRate: 64.8
        }
      ]
    }
  ];

  // Mock user activity reports
  private userReports: UserActivityReport[] = [
    {
      id: 1,
      period: 'Last 7 days',
      startDate: '2025-03-18',
      endDate: '2025-03-24',
      totalActiveUsers: 1875,
      newUsers: 245,
      returningUsers: 1630,
      usersByDay: [
        {
          date: '2025-03-18',
          activeUsers: 318,
          newUsers: 42
        },
        {
          date: '2025-03-19',
          activeUsers: 302,
          newUsers: 38
        },
        {
          date: '2025-03-20',
          activeUsers: 325,
          newUsers: 45
        },
        {
          date: '2025-03-21',
          activeUsers: 380,
          newUsers: 52
        },
        {
          date: '2025-03-22',
          activeUsers: 425,
          newUsers: 65
        },
        {
          date: '2025-03-23',
          activeUsers: 405,
          newUsers: 58
        },
        {
          date: '2025-03-24',
          activeUsers: 345,
          newUsers: 48
        }
      ],
      topUsersByBookings: [
        {
          userId: 145,
          username: 'movie_lover92',
          bookings: 5,
          totalSpent: 82.45
        },
        {
          userId: 287,
          username: 'cinephile2025',
          bookings: 4,
          totalSpent: 67.80
        },
        {
          userId: 318,
          username: 'film_buff_333',
          bookings: 3,
          totalSpent: 52.35
        },
        {
          userId: 192,
          username: 'popcorn_addict',
          bookings: 3,
          totalSpent: 48.25
        },
        {
          userId: 421,
          username: 'weekend_watcher',
          bookings: 2,
          totalSpent: 33.90
        }
      ]
    },
    {
      id: 2,
      period: 'Last 30 days',
      startDate: '2025-02-23',
      endDate: '2025-03-24',
      totalActiveUsers: 7340,
      newUsers: 985,
      returningUsers: 6355,
      usersByDay: [
        // Simplified for brevity - would have 30 entries in a real app
        {
          date: '2025-02-23',
          activeUsers: 245,
          newUsers: 32
        },
        {
          date: '2025-03-01',
          activeUsers: 268,
          newUsers: 38
        },
        {
          date: '2025-03-08',
          activeUsers: 292,
          newUsers: 42
        },
        {
          date: '2025-03-15',
          activeUsers: 345,
          newUsers: 48
        },
        {
          date: '2025-03-22',
          activeUsers: 425,
          newUsers: 65
        }
      ],
      topUsersByBookings: [
        {
          userId: 145,
          username: 'movie_lover92',
          bookings: 12,
          totalSpent: 204.80
        },
        {
          userId: 287,
          username: 'cinephile2025',
          bookings: 10,
          totalSpent: 169.50
        },
        {
          userId: 318,
          username: 'film_buff_333',
          bookings: 8,
          totalSpent: 136.40
        },
        {
          userId: 192,
          username: 'popcorn_addict',
          bookings: 7,
          totalSpent: 119.35
        },
        {
          userId: 421,
          username: 'weekend_watcher',
          bookings: 6,
          totalSpent: 102.60
        }
      ]
    }
  ];

  constructor() { }

  // Get all sales reports
  getSalesReports(): Observable<SalesReport[]> {
    return of([...this.salesReports]).pipe(delay(800));
  }

  // Get sales report by ID
  getSalesReportById(id: number): Observable<SalesReport | undefined> {
    const report = this.salesReports.find(r => r.id === id);
    return of(report).pipe(delay(300));
  }

  // Get all movie performance reports
  getMovieReports(): Observable<MoviePerformanceReport[]> {
    return of([...this.movieReports]).pipe(delay(800));
  }

  // Get movie report by movie ID
  getMovieReportByMovieId(movieId: number): Observable<MoviePerformanceReport | undefined> {
    const report = this.movieReports.find(r => r.movieId === movieId);
    return of(report).pipe(delay(300));
  }

  // Get all user activity reports
  getUserReports(): Observable<UserActivityReport[]> {
    return of([...this.userReports]).pipe(delay(800));
  }

  // Get user report by ID
  getUserReportById(id: number): Observable<UserActivityReport | undefined> {
    const report = this.userReports.find(r => r.id === id);
    return of(report).pipe(delay(300));
  }

  // Generate a custom report based on date range
  generateCustomReport(startDate: string, endDate: string, reportType: 'sales' | 'movie' | 'user'): Observable<any> {
    // This would typically make an API call to generate a custom report
    // For this mock service, we'll just return the most recent report of the requested type
    
    let report: any;
    
    switch(reportType) {
      case 'sales':
        report = this.salesReports[0];
        break;
      case 'movie':
        report = this.movieReports[0];
        break;
      case 'user':
        report = this.userReports[0];
        break;
      default:
        report = null;
    }
    
    // Modify the report to match the requested date range
    if (report) {
      report = {
        ...report,
        period: 'Custom',
        startDate,
        endDate
      };
    }
    
    return of(report).pipe(delay(1000));
  }

  // Export report as CSV (mock function)
  exportReportAsCsv(reportId: number, reportType: 'sales' | 'movie' | 'user'): Observable<boolean> {
    // In a real app, this would generate and download a CSV file
    // For this mock service, we'll just simulate success
    return of(true).pipe(delay(1000));
  }
}