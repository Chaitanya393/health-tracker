import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

import { UsersComponent } from './users.component';
import { User } from './users.model';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  const mockUsers: User[] = [
    {
      id: 1,
      name: 'John Doe',
      workouts: [
        { type: 'Running', minutes: 30 },
        { type: 'Cycling', minutes: 45 }
      ],
      totalWorkouts: 2,
      totalMinutes: 75
    },
    {
      id: 2,
      name: 'Jane Smith',
      workouts: [
        { type: 'Swimming', minutes: 60 }
      ],
      totalWorkouts: 1,
      totalMinutes: 60
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UsersComponent,
        MatPaginatorModule,
        NoopAnimationsModule,
        MatInputModule,
        MatSelectModule,
        FormsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    
    
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUsers));
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users from localStorage', () => {
    expect(component.users.length).toBe(2);
    expect(component.users[0].name).toBe('John Doe');
    expect(component.users[1].name).toBe('Jane Smith');
  });

  it('should filter users by search term', () => {
    component.searchTerm = 'John';
    component.applyFilter();
    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].name).toBe('John Doe');
  });

  it('should filter users by workout type', () => {
    component.selectedWorkoutType = 'Running';
    component.applyFilter();
    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].name).toBe('John Doe');
  });

  it('should clear search', () => {
    component.searchTerm = 'John';
    component.clearSearch();
    expect(component.searchTerm).toBe('');
    expect(component.currentPage).toBe(1);
  });

  it('should clear filter', () => {
    component.selectedWorkoutType = 'Running';
    component.clearFilter();
    expect(component.selectedWorkoutType).toBe('all');
    expect(component.currentPage).toBe(1);
  });

  it('should handle pagination', () => {
    component.pageSize = 1;
    component.currentPage = 2;
    component.applyFilter();
    expect(component.paginatedUsers.length).toBe(1);
    expect(component.paginatedUsers[0].name).toBe('Jane Smith');
  });
});
