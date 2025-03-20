import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: number;
  username: string;
  password: string; // In a real app, never store passwords in plain text
  role: 'admin' | 'user';
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Mock user database
  private users: User[] = [
    { 
      id: 1, 
      username: 'admin', 
      password: 'admin123', 
      role: 'admin',
      name: 'Admin User'
    },
    { 
      id: 2, 
      username: 'user', 
      password: 'user123', 
      role: 'user',
      name: 'Regular User'
    }
  ];

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {
    // Check if there's a user stored in localStorage on initialization
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(username: string, password: string): Observable<boolean> {
    // Find user in our mock database
    const user = this.users.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      // Remove password before storing in localStorage
      const { password, ...secureUser } = user;
      const userToStore = { ...secureUser, password: undefined };
      
      // Store user in localStorage to maintain login between page refreshes
      localStorage.setItem('currentUser', JSON.stringify(userToStore));
      this.currentUserSubject.next(user);
      return of(true);
    }

    return of(false);
  }

  logout(): void {
    // Remove user from localStorage
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}