import { Component, OnInit } from '@angular/core';
import { Claims as ClaimsService } from '../../services/claims';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FileClaim } from "../file-claim/file-claim";

@Component({
  selector: 'app-claims',
  standalone: true,
  imports: [FormsModule, CommonModule, FileClaim],
  templateUrl: './claims.html',
  styleUrl: './claims.css',
})
export class Claims implements OnInit {

  claimsList: any[] = [];
  filteredClaims: any[] = [];

  activeTab: 'All' | 'Pending' | 'Approved' | 'Rejected' = 'All';

  totalClaims = 0;
  approvedCount = 0;
  pendingCount = 0;
  totalAmountReceived = 0;

  showFileModal = false;

  customerId!: number;

  constructor(private claimsService: ClaimsService) {}

ngOnInit(): void {
  const user = JSON.parse(localStorage.getItem('user')!);

  this.claimsService.getCustomerByUserId(user.id, (customer) => {
    if (!customer) return;
    this.customerId = customer.id;

    // ✅ Load claims immediately
    this.loadClaims();
  });
}

 loadClaims() {
  this.claimsService.getClaimsByCustomerId(this.customerId, (claims) => {

    // Prepare claims list
    this.claimsList = claims.map(c => ({
      ...c,
      expanded: false,
      timeline: c.timeline ?? []
    }));

    // Calculate stats
    this.calculateStats();

    // ✅ DIRECTLY set filteredClaims on first load
    this.filteredClaims = [...this.claimsList];

    // ✅ Ensure active tab is All
    this.activeTab = 'All';
  });
}


  calculateStats() {
    this.totalClaims = this.claimsList.length;
    this.approvedCount = this.claimsList.filter(c => c.status === 'Approved').length;
    this.pendingCount = this.claimsList.filter(c => c.status === 'Pending').length;

    this.totalAmountReceived = this.claimsList
      .filter(c => c.status === 'Approved')
      .reduce((sum, c) => sum + c.amount, 0);
  }

  filterClaims(status: any) {
    this.activeTab = status;
    this.filteredClaims =
      status === 'All'
        ? this.claimsList
        : this.claimsList.filter(c => c.status === status);
  }

  toggleExpand(claim: any) {
    claim.expanded = !claim.expanded;
  }

  getStatusIcon(status: string) {
    if (status === 'Approved') return 'check_circle';
    if (status === 'Pending') return 'schedule';
    return 'cancel';
  }

  getStatusColor(status: string) {
    if (status === 'Approved') return 'bg-green-100 text-green-600';
    if (status === 'Pending') return 'bg-blue-100 text-blue-600';
    return 'bg-red-100 text-red-600';
  }

  // ===== Modal Controls =====

  openFileClaimModal() {
    this.showFileModal = true;
  }

  closeFileClaimModal() {
    this.showFileModal = false;
    this.loadClaims(); // ✅ refresh after new claim
  }
}
