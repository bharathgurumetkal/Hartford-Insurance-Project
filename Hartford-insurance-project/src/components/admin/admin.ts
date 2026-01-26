import { Component } from '@angular/core';
import { SystemOverview } from '../system-overview/system-overview';

@Component({
  selector: 'app-admin',
  imports: [SystemOverview],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {

}
