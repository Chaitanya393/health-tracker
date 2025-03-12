import { TestBed } from '@angular/core/testing';
import { ChartService } from './chart.service';
import { User } from '@/app/components/users/users.model';
import Chart from 'chart.js/auto';

describe('ChartService', () => {
  let service: ChartService;
  let mockUser: User;
  let mockCanvas: HTMLCanvasElement;
  let mockChart: Chart;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChartService]
    });
    service = TestBed.inject(ChartService);

  
    mockUser = {
      id: 1,
      name: 'Test User',
      workouts: [
        { type: 'Running', minutes: 30 },
        { type: 'Cycling', minutes: 45 }
      ],
      totalWorkouts: 2,
      totalMinutes: 75
    };

   
    mockCanvas = document.createElement('canvas');
    const mockContext = mockCanvas.getContext('2d');

   
    spyOn(Chart.prototype, 'update').and.callThrough();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a chart with correct configuration', () => {
  
    service.createChart(mockCanvas, mockUser);

   
    const chart = (service as any).chart;

   
    expect(chart.config.type).toBe('bar');
    expect(chart.data.labels).toEqual(['Running', 'Cycling']);
    expect(chart.data.datasets[0].data).toEqual([30, 45]);
    expect(chart.data.datasets[0].label).toBe('Workout Duration (minutes)');
  });

  it('should update chart data when updateChart is called', () => {

    service.createChart(mockCanvas, mockUser);
    

    const updatedUser: User = {
      id: 1,
      name: 'Test User',
      workouts: [
        { type: 'Swimming', minutes: 60 },
        { type: 'Yoga', minutes: 40 }
      ],
      totalWorkouts: 2,
      totalMinutes: 100
    };

   
    service.updateChart(updatedUser);

    
    const chart = (service as any).chart;

  
    expect(chart.data.labels).toEqual(['Swimming', 'Yoga']);
    expect(chart.data.datasets[0].data).toEqual([60, 40]);
    expect(Chart.prototype.update).toHaveBeenCalledWith('active');
  });

  it('should handle empty workout data', () => {
    const emptyUser: User = {
      id: 1,
      name: 'Test User',
      workouts: [],
      totalWorkouts: 0,
      totalMinutes: 0
    };

   
    service.createChart(mockCanvas, emptyUser);
    
  
    const chart = (service as any).chart;

  
    expect(chart.data.labels).toEqual([]);
    expect(chart.data.datasets[0].data).toEqual([]);
  });

  it('should maintain chart styling after updates', () => {

    service.createChart(mockCanvas, mockUser);
    
    
    const chart = (service as any).chart;
    const initialStyling = {
      backgroundColor: chart.data.datasets[0].backgroundColor,
      borderRadius: chart.data.datasets[0].borderRadius,
      maxBarThickness: chart.data.datasets[0].maxBarThickness
    };

    
    service.updateChart(mockUser);


    expect(chart.data.datasets[0].backgroundColor).toBe(initialStyling.backgroundColor);
    expect(chart.data.datasets[0].borderRadius).toBe(initialStyling.borderRadius);
    expect(chart.data.datasets[0].maxBarThickness).toBe(initialStyling.maxBarThickness);
  });
});
