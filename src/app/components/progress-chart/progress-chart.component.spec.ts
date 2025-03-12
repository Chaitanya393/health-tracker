import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressChartComponent } from './progress-chart.component';
import { ChartService } from '@/app/services/chart/chart.service';
import { User } from '@/app/components/users/users.model';

describe('ProgressChartComponent', () => {
  let component: ProgressChartComponent;
  let fixture: ComponentFixture<ProgressChartComponent>;
  let chartService: ChartService;

  const mockUser: User = {
    id: 1,
    name: 'John Doe',
    workouts: [
      { type: 'Running', minutes: 30 },
      { type: 'Cycling', minutes: 45 }
    ],
    totalWorkouts: 2,
    totalMinutes: 75
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressChartComponent],
      providers: [ChartService]
    }).compileComponents();

    chartService = TestBed.inject(ChartService);
    fixture = TestBed.createComponent(ProgressChartComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    spyOn(component, 'loadUsers').and.callFake(() => {
      component.users = [mockUser];
      return;
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    component.ngOnInit();
    expect(component.users.length).toBe(1);
    expect(component.users[0].name).toBe('John Doe');
  });

  it('should initialize chart after view init', () => {
    spyOn(chartService, 'createChart');
    component.ngAfterViewInit();
    expect(chartService.createChart).toHaveBeenCalled();
  });

  it('should update chart when selecting user', () => {
    spyOn(chartService, 'updateChart');
    component.onSelectUser(mockUser);
    expect(component.selectedUser).toBe(mockUser);
    expect(chartService.updateChart).toHaveBeenCalledWith(mockUser);
  });
});
