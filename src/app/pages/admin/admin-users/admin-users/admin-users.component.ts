import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminUserService, User } from '../../../../services/admin-user.service'

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedUser: User | null = null;
  userForm: FormGroup;
  isEditing = false;
  isLoading = true;
  showDeleteConfirmation = false;
  deleteId: number | null = null;
  formMessage = { text: '', type: '' };
  viewingUserBookings = false;
  userBookings: any[] = [];
  isLoadingBookings = false;
  
  // Filter variables
  statusFilter: string = '';
  roleFilter: string = '';
  searchFilter: string = '';

  constructor(
    private adminUserService: AdminUserService,
    private fb: FormBuilder
  ) {
    this.userForm = this.createUserForm();
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.adminUserService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
      }
    });
  }

  createUserForm(): FormGroup {
    return this.fb.group({
      id: [0],
      username: ['', [Validators.required, Validators.minLength(4)]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['user', Validators.required],
      status: ['active', Validators.required],
      password: ['', this.isEditing ? [] : [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', this.isEditing ? [] : [Validators.required]],
      avatar: [''],
      // These fields will be auto-generated and not included in the form for editing
      registrationDate: [new Date().toISOString()],
      lastLogin: [new Date().toISOString()],
      bookingsCount: [0]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password === confirmPassword) {
      return null;
    }
    
    return { passwordMismatch: true };
  }

  applyFilters(): void {
    let filtered = [...this.users];
    
    // Apply status filter
    if (this.statusFilter) {
      filtered = filtered.filter(user => user.status === this.statusFilter);
    }
    
    // Apply role filter
    if (this.roleFilter) {
      filtered = filtered.filter(user => user.role === this.roleFilter);
    }
    
    // Apply search filter (search by name, username, or email)
    if (this.searchFilter) {
      const searchTerm = this.searchFilter.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }
    
    this.filteredUsers = filtered;
  }
  
  onStatusFilterChange(): void {
    this.applyFilters();
  }
  
  onRoleFilterChange(): void {
    this.applyFilters();
  }
  
  onSearchFilterChange(): void {
    this.applyFilters();
  }
  
  clearFilters(): void {
    this.statusFilter = '';
    this.roleFilter = '';
    this.searchFilter = '';
    this.applyFilters();
  }

  editUser(user: User): void {
    this.isEditing = true;
    this.selectedUser = user;
    
    // When editing, don't require password fields
    this.userForm = this.fb.group({
      id: [user.id],
      username: [user.username, [Validators.required, Validators.minLength(4)]],
      name: [user.name, [Validators.required]],
      email: [user.email, [Validators.required, Validators.email]],
      role: [user.role, Validators.required],
      status: [user.status, Validators.required],
      password: [''],
      confirmPassword: [''],
      avatar: [user.avatar],
      registrationDate: [user.registrationDate],
      lastLogin: [user.lastLogin],
      bookingsCount: [user.bookingsCount]
    }, { validators: this.passwordMatchValidator });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  newUser(): void {
    this.isEditing = false;
    this.selectedUser = null;
    this.userForm = this.createUserForm();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.selectedUser = null;
    this.userForm = this.createUserForm();
    this.formMessage = { text: '', type: '' };
  }

  confirmDelete(id: number): void {
    this.deleteId = id;
    this.showDeleteConfirmation = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
    this.deleteId = null;
  }

  deleteUser(): void {
    if (this.deleteId) {
      this.adminUserService.deleteUser(this.deleteId).subscribe({
        next: () => {
          this.loadUsers();
          this.showDeleteConfirmation = false;
          this.deleteId = null;
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      // Check for password mismatch
      if (this.userForm.hasError('passwordMismatch')) {
        this.formMessage = { text: 'Passwords do not match', type: 'error' };
        return;
      }
      
      this.formMessage = { text: 'Please fill all required fields correctly', type: 'error' };
      return;
    }

    const userData = this.userForm.value;
    
    // Remove confirm password field before sending to service
    delete userData.confirmPassword;
    
    if (this.isEditing) {
      // If password is empty when editing, remove it from the data
      if (!userData.password) {
        delete userData.password;
      }
      
      // Update existing user
      this.adminUserService.updateUser(userData).subscribe({
        next: () => {
          this.loadUsers();
          this.formMessage = { text: 'User updated successfully', type: 'success' };
          setTimeout(() => this.cancelEdit(), 2000);
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.formMessage = { text: 'Error updating user', type: 'error' };
        }
      });
    } else {
      // Create new user
      this.adminUserService.addUser(userData).subscribe({
        next: () => {
          this.loadUsers();
          this.formMessage = { text: 'User added successfully', type: 'success' };
          setTimeout(() => this.cancelEdit(), 2000);
        },
        error: (error) => {
          console.error('Error adding user:', error);
          this.formMessage = { text: 'Error adding user', type: 'error' };
        }
      });
    }
  }

  viewUserBookings(userId: number): void {
    this.isLoadingBookings = true;
    this.viewingUserBookings = true;
    
    this.adminUserService.getUserBookings(userId).subscribe({
      next: (bookings) => {
        this.userBookings = bookings;
        this.isLoadingBookings = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.isLoadingBookings = false;
      }
    });
  }

  closeUserBookings(): void {
    this.viewingUserBookings = false;
    this.userBookings = [];
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active': return 'Active';
      case 'inactive': return 'Inactive';
      case 'suspended': return 'Suspended';
      default: return status;
    }
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'user': return 'Regular User';
      default: return role;
    }
  }
}