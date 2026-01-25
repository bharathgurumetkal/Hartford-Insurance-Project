import { Component,AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto'

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements AfterViewInit {

  ngAfterViewInit(): void {
    this.loadRevenueChart();
    this.loadPerformanceChart();
  }

  loadRevenueChart() {
    new Chart('revenueChart', {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Income',
            data: [30, 45, 28, 60, 50, 70],
            backgroundColor: '#16a34a',
          },
          {
            label: 'Expenses',
            data: [20, 35, 25, 40, 38, 55],
            backgroundColor: '#a3e635',
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          }
        }
      }
    });
  }

  loadPerformanceChart() {
    new Chart('performanceChart', {
      type: 'doughnut',
      data: {
        labels: ['Sales', 'View Count', 'Percentage'],
        datasets: [{
          data: [23, 68, 16],
          backgroundColor: ['#15803d', '#84cc16', '#fb923c']
        }]
      },
      options: {
        responsive: true,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
}