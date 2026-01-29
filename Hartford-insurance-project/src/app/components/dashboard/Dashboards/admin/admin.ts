import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../../../auth/services/auth';
import { StatCardComponent } from '../../../stat-card/stat-card';
import { DataTable } from '../../../data-table/data-table';

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

  constructor(private api: Auth) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
/*
  ngOnInit(): void {
    this.loadDashboardStats();
    
  }
/*
  loadDashboardStats() {
    this.api.getCustomers().subscribe(customers => {
      this.api.getPolicies().subscribe(policies => {
        this.api.getClaims().subscribe(claims => {

         

        });
      });
    });
  }*/

  // loadRecentClaims() {
  //   this.api.getClaims().subscribe(data => {
  //     this.claims = data;
  //   });
  // }
}
