import { Component,Input } from "@angular/core";
import { CommonModule } from "@angular/common";
@Component({
  selector: 'app-stat-card',
  imports:[CommonModule],
  standalone: true,
  templateUrl: './stat-card.html',
})
export class StatCardComponent {
  @Input() title!: string;
@Input() value!: string | number;
@Input() trend!: string;           // "+5% from last month"
@Input() icon!: string;            // material icon name

@Input() iconBg!: string;           // e.g. 'bg-blue-50'
@Input() iconColor!: string;        // e.g. 'text-blue-600'
@Input() trendColor!: string;       // e.g. 'text-green-600'

}
