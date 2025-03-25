import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface User {
    id: number;
    username: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    status: 'active' | 'inactive' | 'suspended';
    registrationDate: string;
    lastLogin: string;
    avatar?: string;
    bookingsCount: number;
}

@Injectable({
    providedIn: 'root'
})

export class AdminUserService {
    private users: User[] = [
      {
        id: 1,
        username: 'admin',
        name: 'Admin User',
        email: 'admin@angularcinema.com',
        role: 'admin',
        status: 'active',
        registrationDate: '2022-01-15T10:30:00',
        lastLogin: '2025-03-24T08:45:22',
        avatar: '/assets/images/avatars/admin.jpg',
        bookingsCount: 12
      },
      {
        id: 2,
        username: 'jdoe',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'user',
        status: 'active',
        registrationDate: '2022-03-10T14:20:00',
        lastLogin: '2025-03-22T19:30:15',
        avatar: '/assets/images/avatars/user1.jpg',
        bookingsCount: 28
      },
      {
        id: 3,
        username: 'janesmith',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        role: 'user',
        status: 'active',
        registrationDate: '2022-05-22T09:15:00',
        lastLogin: '2025-03-23T15:40:10',
        avatar: '/assets/images/avatars/user2.jpg',
        bookingsCount: 15
      },
      {
        id: 4,
        username: 'mjohnson',
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        role: 'user',
        status: 'inactive',
        registrationDate: '2022-08-05T16:45:00',
        lastLogin: '2025-01-10T12:30:00',
        avatar: '/assets/images/avatars/user3.jpg',
        bookingsCount: 8
      },
      {
        id: 5,
        username: 'swilliams',
        name: 'Sarah Williams',
        email: 'sarah.williams@example.com',
        role: 'user',
        status: 'suspended',
        registrationDate: '2023-02-18T11:20:00',
        lastLogin: '2025-02-15T10:15:30',
        avatar: '/assets/images/avatars/user4.jpg',
        bookingsCount: 5
      },
      {
        id: 6,
        username: 'rbrown',
        name: 'Robert Brown',
        email: 'robert.brown@example.com',
        role: 'admin',
        status: 'active',
        registrationDate: '2023-06-30T13:10:00',
        lastLogin: '2025-03-23T09:20:45',
        avatar: '/assets/images/avatars/admin2.jpg',
        bookingsCount: 10
      }
    ];

    construtor() {}

    getUsers(): Observable<User[]> {
        return of([...this.users]).pipe(delay(800));
      }
    
      getUserById(id: number): Observable<User | undefined> {
        const user = this.users.find(u => u.id === id);
        return of(user).pipe(delay(300));
      }
    
      addUser(user: User): Observable<User> {
        // Assign a new ID (simple implementation for mock service)
        const newId = Math.max(0, ...this.users.map(u => u.id)) + 1;
        const newUser = { ...user, id: newId };
        
        this.users.push(newUser);
        return of(newUser).pipe(delay(500));
      }
    
      updateUser(user: User): Observable<User> {
        const index = this.users.findIndex(u => u.id === user.id);
        
        if (index >= 0) {
          this.users[index] = { ...user };
          return of(this.users[index]).pipe(delay(500));
        }
        
        throw new Error('User not found');
      }
    
      deleteUser(id: number): Observable<boolean> {
        const index = this.users.findIndex(u => u.id === id);
        
        if (index >= 0) {
          this.users.splice(index, 1);
          return of(true).pipe(delay(500));
        }
        
        return of(false).pipe(delay(500));
      }
    
      getUserBookings(userId: number): Observable<any[]> {
        // Mock booking data - in a real application, this would come from a bookings service or database
        const mockBookings = [
          {
            id: 101,
            userId: 2,
            movieTitle: 'The Matrix Resurrections',
            date: '2025-03-10T19:30:00',
            seats: ['A12', 'A13'],
            totalAmount: 25.98,
            status: 'completed'
          },
          {
            id: 102,
            userId: 2,
            movieTitle: 'Dune',
            date: '2025-03-18T20:15:00',
            seats: ['C5', 'C6', 'C7'],
            totalAmount: 38.97,
            status: 'completed'
          },
          {
            id: 103,
            userId: 3,
            movieTitle: 'Spider-Man: No Way Home',
            date: '2025-03-15T14:45:00',
            seats: ['B9'],
            totalAmount: 12.99,
            status: 'completed'
          },
          {
            id: 104,
            userId: 4,
            movieTitle: 'The Batman',
            date: '2025-02-28T21:00:00',
            seats: ['D12', 'D13'],
            totalAmount: 25.98,
            status: 'cancelled'
          }
        ];
        
        const userBookings = mockBookings.filter(booking => booking.userId === userId);
        return of(userBookings).pipe(delay(500));
      }
    }
