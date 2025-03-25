// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MovieListComponent } from './pages/movie-list/movie-list.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminMoviesComponent } from './pages/admin/admin-movies/admin-movies/admin-movies.component';
import { AdminReviewsComponent } from './pages/admin/admin-reviews/admin-reviews/admin-reviews.component';
import { AdminSchedulesComponent } from './pages/admin/admin-schedules/admin-schedules/admin-schedules.component';
import { AdminUsersComponent } from './pages/admin/admin-users/admin-users/admin-users.component';
import { AdminTicketsComponent } from './pages/admin/admin-tickets/admin-tickets/admin-tickets.component';
import { AdminReportsComponent } from './pages/admin/admin-reports/admin-reports/admin-reports.component';
import { BookingComponent } from './pages/booking/booking.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'movies', component: MovieListComponent },
  { path: 'movies/:id', component: MovieDetailsComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'booking/:id', 
    component: BookingComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'admin', 
    component: AdminComponent, 
    canActivate: [AuthGuard, AdminGuard] 
  },
  {
    path: 'admin/movies',
    component: AdminMoviesComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/reviews',
    component: AdminReviewsComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/schedules',
    component: AdminSchedulesComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/users',
    component: AdminUsersComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/tickets',
    component: AdminTicketsComponent,
    canActivate: [AuthGuard, AdminGuard]
  },

  {
    path: 'admin/reports',
    component: AdminReportsComponent,
    canActivate: [AuthGuard, AdminGuard]
  },

  { path: '**', redirectTo: '' }
];