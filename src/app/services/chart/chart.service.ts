import { Injectable } from '@angular/core';
import Chart from 'chart.js/auto';

import { User } from '@/app/components/users/users.model';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  private chart: Chart | null = null;

  constructor() {}

  createChart(chartRef: HTMLCanvasElement, user: User) {
    const ctx = chartRef.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: user.workouts.map(w => w.type),
          datasets: [
            {
              label: 'Workout Duration (minutes)',
              data: user.workouts.map(w => w.minutes),
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 1,
              borderRadius: 8,
              maxBarThickness: 50,
              hoverBackgroundColor: 'rgb(59, 130, 246)',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                font: {
                  size: 14,
                  family: "'Roboto', sans-serif"
                },
                usePointStyle: true,
                padding: 20
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleFont: {
                size: 14,
                family: "'Roboto', sans-serif"
              },
              bodyFont: {
                size: 13,
                family: "'Roboto', sans-serif"
              },
              padding: 12,
              cornerRadius: 8,
              callbacks: {
                label: function(context) {
                  return `Duration: ${context.parsed.y} minutes`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              border: {
                display: false
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                font: {
                  size: 12,
                  family: "'Roboto', sans-serif"
                },
                padding: 8
              },
              title: {
                display: true,
                text: 'Minutes',
                font: {
                  size: 14,
                  family: "'Roboto', sans-serif",
                  weight: 'bold'
                },
                padding: { bottom: 10 }
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                font: {
                  size: 12,
                  family: "'Roboto', sans-serif"
                },
                padding: 8
              },
              title: {
                display: true,
                text: 'Workout Type',
                font: {
                  size: 14,
                  family: "'Roboto', sans-serif",
                  weight: 'bold'
                },
                padding: { top: 10 }
              }
            }
          },
          animation: {
            duration: 750,
            easing: 'easeInOutQuart'
          }
        },
      });
    }
  }

  updateChart(user: User) {
    if (this.chart) {
      this.chart.data.labels = user.workouts.map(w => w.type);
      this.chart.data.datasets[0].data = user.workouts.map(w => w.minutes);
      this.chart.update('active');
    }
  }
}
