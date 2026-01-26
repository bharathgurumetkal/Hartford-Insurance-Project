import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  templateUrl: './stat-card.html'
})
export class StatCardComponent {
  @Input() label!: string;
  @Input() value!: number | string;
  @Input() icon: string = '';
}
