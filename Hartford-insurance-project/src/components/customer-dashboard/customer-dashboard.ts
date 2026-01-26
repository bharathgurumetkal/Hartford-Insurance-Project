import { Component } from '@angular/core';
import { Claims } from '../../services/claims';
import { Router } from '@angular/router';
import { FileClaim } from '../file-claim/file-claim';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-customer-dashboard',
  imports: [CommonModule,FileClaim],
  templateUrl: './customer-dashboard.html',
  styleUrl: './customer-dashboard.css',
})
export class CustomerDashboard {
  customerName = '';
  activePoliciesCount = 0;
  pendingClaimsCount = 0;
  renewalAlertsCount = 0;

  showFileModal = false;
  customerId!: number;

  constructor(
    private claimsService: Claims,
    private router: Router
  ) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user')!);

    // Get customer
    this.claimsService.getCustomerByUserId(user.id, (customer) => {
      if (!customer) return;

      this.customerName = customer.fullName;
      this.customerId = customer.id;

      // Active policies count
      this.activePoliciesCount = customer.policyIds.length;

      // Get claims
      this.claimsService.getClaimsByCustomerId(customer.id, (claims) => {
        this.pendingClaimsCount = claims.filter(c => c.status === 'Pending').length;
      });

      // Dummy renewal alerts (replace later with real API)
      this.renewalAlertsCount = Math.floor(Math.random() * 3) + 1;
    });
  }

  goToPolicies() {
    this.router.navigate(['/policies']);
  }

  openFileClaimModal() {
    this.showFileModal = true;
  }

  closeFileClaimModal() {
    this.showFileModal = false;
  }

}
