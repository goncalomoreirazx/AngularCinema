import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { 
  AdminReportService, 
  SalesReport, 
  MoviePerformanceReport, 
  UserActivityReport 
} from '../../../../services/admin-report.service';
import { AdminMovieService } from '../../../../services/admin-movie.service';

interface ReportOverview {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'sales' | 'movie' | 'user';
}

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-reports.component.html',
  styleUrl: './admin-reports.component.scss'
})
export class AdminReportsComponent implements OnInit {
  reportTypes: ReportOverview[] = [
    {
      id: 'sales',
      title: 'Sales & Revenue',
      description: 'View ticket sales, revenue, and performance metrics over time',
      icon: 'chart-line',
      type: 'sales'
    },
    {
      id: 'movie',
      title: 'Movie Performance',
      description: 'Analyze how individual movies are performing',
      icon: 'film',
      type: 'movie'
    },
    {
      id: 'user',
      title: 'User Activity',
      description: 'Track user engagement, bookings, and spending habits',
      icon: 'users',
      type: 'user'
    }
  ];

  // Selected report type
  selectedReportType: string = '';
  
  // Report data
  salesReports: SalesReport[] = [];
  movieReports: MoviePerformanceReport[] = [];
  userReports: UserActivityReport[] = [];
  
  // Selected reports
  selectedSalesReport: SalesReport | null = null;
  selectedMovieReport: MoviePerformanceReport | null = null;
  selectedUserReport: UserActivityReport | null = null;
  
  // Form for custom report
  customReportForm: FormGroup;
  
  // UI states
  isLoading: boolean = false;
  showCustomReportForm: boolean = false;
  reportMessage = { text: '', type: '' };

  // Movies list for dropdown
  movies: any[] = [];

  constructor(
    private adminReportService: AdminReportService,
    private adminMovieService: AdminMovieService,
    private fb: FormBuilder
  ) {
    this.customReportForm = this.createReportForm();
  }

  ngOnInit(): void {
    // Load movies for the dropdown
    this.loadMovies();
  }

  createReportForm(): FormGroup {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    return this.fb.group({
      reportType: ['sales', Validators.required],
      startDate: [this.formatDate(sevenDaysAgo), Validators.required],
      endDate: [this.formatDate(today), Validators.required],
      movieId: ['']
    });
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  loadMovies(): void {
    this.adminMovieService.getMovies().subscribe({
      next: (movies) => {
        this.movies = movies;
      },
      error: (error) => {
        console.error('Error loading movies:', error);
      }
    });
  }

  selectReportType(type: string): void {
    this.selectedReportType = type;
    this.showCustomReportForm = false;
    this.reportMessage = { text: '', type: '' };
    
    switch(type) {
      case 'sales':
        this.loadSalesReports();
        break;
      case 'movie':
        this.loadMovieReports();
        break;
      case 'user':
        this.loadUserReports();
        break;
    }
  }

  loadSalesReports(): void {
    this.isLoading = true;
    this.adminReportService.getSalesReports().subscribe({
      next: (reports) => {
        this.salesReports = reports;
        if (reports.length > 0) {
          this.selectSalesReport(reports[0]);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading sales reports:', error);
        this.isLoading = false;
        this.reportMessage = { text: 'Failed to load sales reports', type: 'error' };
      }
    });
  }

  loadMovieReports(): void {
    this.isLoading = true;
    this.adminReportService.getMovieReports().subscribe({
      next: (reports) => {
        this.movieReports = reports;
        if (reports.length > 0) {
          this.selectMovieReport(reports[0]);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading movie reports:', error);
        this.isLoading = false;
        this.reportMessage = { text: 'Failed to load movie reports', type: 'error' };
      }
    });
  }

  loadUserReports(): void {
    this.isLoading = true;
    this.adminReportService.getUserReports().subscribe({
      next: (reports) => {
        this.userReports = reports;
        if (reports.length > 0) {
          this.selectUserReport(reports[0]);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user reports:', error);
        this.isLoading = false;
        this.reportMessage = { text: 'Failed to load user reports', type: 'error' };
      }
    });
  }

  selectSalesReport(report: SalesReport): void {
    this.selectedSalesReport = report;
  }

  selectMovieReport(report: MoviePerformanceReport): void {
    this.selectedMovieReport = report;
  }

  selectUserReport(report: UserActivityReport): void {
    this.selectedUserReport = report;
  }

  showCustomReport(): void {
    this.showCustomReportForm = true;
    
    // Reset selected reports
    this.selectedSalesReport = null;
    this.selectedMovieReport = null;
    this.selectedUserReport = null;
  }

  cancelCustomReport(): void {
    this.showCustomReportForm = false;
    this.customReportForm.reset({
      reportType: 'sales',
      startDate: this.formatDate(new Date(new Date().setDate(new Date().getDate() - 7))),
      endDate: this.formatDate(new Date()),
      movieId: ''
    });
  }

  generateCustomReport(): void {
    if (this.customReportForm.invalid) {
      this.reportMessage = { text: 'Please fill all required fields correctly', type: 'error' };
      return;
    }

    const { reportType, startDate, endDate, movieId } = this.customReportForm.value;
    
    this.isLoading = true;
    this.reportMessage = { text: '', type: '' };

    // For movie reports, we need to handle the movie ID specifically
    if (reportType === 'movie' && movieId) {
      this.adminReportService.getMovieReportByMovieId(parseInt(movieId)).subscribe({
        next: (report) => {
          if (report) {
            this.movieReports = [report];
            this.selectMovieReport(report);
          } else {
            this.reportMessage = { text: 'No data available for the selected movie', type: 'error' };
          }
          this.isLoading = false;
          this.showCustomReportForm = false;
        },
        error: (error) => {
          console.error('Error generating custom report:', error);
          this.isLoading = false;
          this.reportMessage = { text: 'Failed to generate custom report', type: 'error' };
        }
      });
    } else {
      // For sales and user reports, generate based on date range
      this.adminReportService.generateCustomReport(
        startDate, 
        endDate, 
        reportType as 'sales' | 'movie' | 'user'
      ).subscribe({
        next: (report) => {
          if (report) {
            switch(reportType) {
              case 'sales':
                this.salesReports = [report];
                this.selectSalesReport(report);
                break;
              case 'movie':
                this.movieReports = [report];
                this.selectMovieReport(report);
                break;
              case 'user':
                this.userReports = [report];
                this.selectUserReport(report);
                break;
            }
            this.showCustomReportForm = false;
          } else {
            this.reportMessage = { text: 'No data available for the selected period', type: 'error' };
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error generating custom report:', error);
          this.isLoading = false;
          this.reportMessage = { text: 'Failed to generate custom report', type: 'error' };
        }
      });
    }
  }

  exportReport(reportType: string): void {
    let reportId: number | undefined;
    
    switch(reportType) {
      case 'sales':
        reportId = this.selectedSalesReport?.id;
        break;
      case 'movie':
        reportId = this.selectedMovieReport?.id;
        break;
      case 'user':
        reportId = this.selectedUserReport?.id;
        break;
    }
    
    if (!reportId) {
      this.reportMessage = { text: 'No report selected to export', type: 'error' };
      return;
    }
    
    this.isLoading = true;
    this.adminReportService.exportReportAsCsv(reportId, reportType as any).subscribe({
      next: (success) => {
        if (success) {
          this.reportMessage = { text: 'Report exported successfully', type: 'success' };
        } else {
          this.reportMessage = { text: 'Failed to export report', type: 'error' };
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error exporting report:', error);
        this.isLoading = false;
        this.reportMessage = { text: 'Failed to export report', type: 'error' };
      }
    });
  }

  getMovieTitleById(id: number): string {
    const movie = this.movies.find(m => m.id === id);
    return movie ? movie.title : 'Unknown Movie';
  }

  // Helper method for displaying dates
  formatDisplayDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}