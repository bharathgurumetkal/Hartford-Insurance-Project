import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminDashboardComponent } from '../features/dashboard/Dashboards/admin/admin';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,AdminDashboardComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Hartford-insurance-project');
}
