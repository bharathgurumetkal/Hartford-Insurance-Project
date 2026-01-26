import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';
import { StatCardComponent } from '../../../../app/components/stat-card/stat-card';
import { DataTable } from '../../../../app/components/data-table/data-table';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, StatCardComponent, DataTable],
  templateUrl: './admin.html',
})
export class AdminDashboardComponent implements OnInit {

  stats: any[] = [];

  columns = ['Policy', 'Customer', 'Amount', 'Status'];
  keys = ['policyId', 'customerId', 'amount', 'status'];

  claims: any[] = [];

  constructor(private api: AuthService) {}

  ngOnInit(): void {
    this.loadDashboardStats();
    
  }

  loadDashboardStats() {
    this.api.getCustomers().subscribe(customers => {
      this.api.getPolicies().subscribe(policies => {
        this.api.getClaims().subscribe(claims => {

         

        });
      });
    });
  }

  // loadRecentClaims() {
  //   this.api.getClaims().subscribe(data => {
  //     this.claims = data;
  //   });
  // }
}
