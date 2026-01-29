import { Component, Input } from '@angular/core';
import { Auth } from '../../../auth/services/auth';
@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html'
})
export class HeaderComponent {
  @Input() title: string = 'Dashboard';
  @Input() role: string = '';
  @Input() username: string = '';
  
}
