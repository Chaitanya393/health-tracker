import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { User } from '@/app/components/users/users.model';
import { workoutOptions } from '@/app/components/add-user/add-user.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];
  workoutOptions = [{ value: 'all', viewValue: 'All' }, ...workoutOptions];
  selectedWorkoutType: string = 'all';
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 5;

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    const workoutDataString = localStorage.getItem('workoutData');
    if (workoutDataString) {
      this.users = JSON.parse(workoutDataString);
      this.applyFilter();
    }
  }

  applyFilter() {
  
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesWorkout = this.selectedWorkoutType === 'all' || 
        user.workouts.some(w => w.type.toLowerCase() === this.selectedWorkoutType.toLowerCase());
      return matchesSearch && matchesWorkout;
    });

    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    this.updatePaginatedUsers();
  }

  updatePaginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  search(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value.trim();
    this.currentPage = 1;
    this.applyFilter();
  }

  filterByWorkoutType(event: Event): void {
    this.selectedWorkoutType = (event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.applyFilter();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedUsers();
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedUsers();
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.applyFilter();
  }

  clearFilter(): void {
    this.selectedWorkoutType = 'all';
    this.currentPage = 1;
    this.applyFilter();
  }

  getWorkoutTypeLabel(value: string): string {
    const option = this.workoutOptions.find(opt => opt.value === value);
    return option ? option.viewValue : value;
  }

  onPageSizeChange(event: Event): void {
    const newSize = parseInt((event.target as HTMLSelectElement).value);
    this.pageSize = newSize;
    this.currentPage = 1;
    this.applyFilter(); 
  }
}

export { User };
