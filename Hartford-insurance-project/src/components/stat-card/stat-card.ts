import { Component,Input } from "@angular/core";
import { CommonModule } from "@angular/common";
@Component({
  selector: 'app-stat-card',
  imports:[CommonModule],
  standalone: true,
  templateUrl: './stat-card.html',
})
export class StatCardComponent {
  @Input() title = '';
  @Input() value: number | string = 0;
  @Input() icon = '';
  @Input() color: 'blue' | 'green' | 'orange' | 'purple'| 'red'  = 'blue';
}
