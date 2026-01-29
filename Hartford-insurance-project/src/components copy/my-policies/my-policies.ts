import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-policies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-policies.html'
})
export class MyPoliciesComponent {

}