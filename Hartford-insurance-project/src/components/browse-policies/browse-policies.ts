import { Component, ChangeDetectorRef } from '@angular/core';
import { PolicyService } from '../../services/policy-service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { PurchasedPolicyService } from '../../services/purchased-policy.service';

@Component({
  selector: 'app-browse-policies',
  imports: [CommonModule, FormsModule],
  templateUrl: './browse-policies.html',
  styleUrl: './browse-policies.css',
})
export class BrowsePolicies {

  policies: any[] = [];
  filteredPolicies: any[] = [];
  allPolicies: any[] = [];
  policyTypes: string[] = [];

  // Filter properties
  filters = {
    type: '',
    minPremium: 0,
    maxPremium: 100000,
    minCoverage: 0,
    maxCoverage: 10000000
  };

  // Comparison
  selectedForComparison: any[] = [];
  showComparisonModal = false;

  // Detailed view
  selectedPolicy: any = null;
  showDetailsModal = false;

  // Purchased policies tracking
  purchasedPolicyIds: Set<string> = new Set();

  constructor(
    private policyService: PolicyService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private purchasedPolicyService: PurchasedPolicyService
  ) { }

  ngOnInit(): void {
    this.loadPolicies();
    this.loadPolicyTypes();

    // Subscribe to purchased policies to track which ones are already bought
    this.purchasedPolicyService.getPurchasedPolicies$().subscribe(policies => {
      this.purchasedPolicyIds = new Set(policies.map(p => p.policyId));
      this.cdr.detectChanges();
    });

    this.cdr.detectChanges();
  }

  loadPolicies(): void {
    this.policyService.getPolicies().subscribe(d => {
      this.policies = d;
      this.allPolicies = d;
      this.filteredPolicies = d;
      this.cdr.detectChanges();
    });
  }

  loadPolicyTypes(): void {

    this.policyService.getPolicyTypes().subscribe(types => {
      this.policyTypes = types;

    });
    this.cdr.detectChanges();
  }

  applyFilters(): void {

    const filterParams: any = {};

    if (this.filters.type) {
      filterParams.type = this.filters.type;
      this.cdr.detectChanges();
    }
    if (this.filters.minPremium > 0) {
      filterParams.minPremium = this.filters.minPremium;
    }
    if (this.filters.maxPremium < 100000) {
      filterParams.maxPremium = this.filters.maxPremium;
    }
    if (this.filters.minCoverage > 0) {
      filterParams.minCoverage = this.filters.minCoverage;
    }
    if (this.filters.maxCoverage < 10000000) {
      filterParams.maxCoverage = this.filters.maxCoverage;
    }

    this.policyService.filterPolicies(filterParams).subscribe(filtered => {
      this.filteredPolicies = filtered;
      this.cdr.detectChanges();
    });
  }

  resetFilters(): void {
    this.filters = {
      type: '',
      minPremium: 0,
      maxPremium: 100000,
      minCoverage: 0,
      maxCoverage: 10000000
    };
    this.filteredPolicies = this.allPolicies;
    this.cdr.detectChanges();
  }

  toggleComparison(policy: any, event: Event): void {
    event.stopPropagation();
    const index = this.selectedForComparison.findIndex(p => p.id === policy.id);

    if (index > -1) {
      this.selectedForComparison.splice(index, 1);
    } else {
      if (this.selectedForComparison.length < 3) {
        this.selectedForComparison.push(policy);
      } else {
        alert('You can compare up to 3 policies at a time');
      }
    }
  }

  isSelectedForComparison(policy: any): boolean {
    return this.selectedForComparison.some(p => p.id === policy.id);
  }

  compareSelected(): void {
    if (this.selectedForComparison.length < 2) {
      alert('Please select at least 2 policies to compare');
      return;
    }
    this.showComparisonModal = true;
  }

  closeComparisonModal(): void {
    this.showComparisonModal = false;
  }

  viewDetails(policy: any): void {
    this.selectedPolicy = policy;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedPolicy = null;
  }

  buyNow(policyId: string): void {
    console.log('BUY NOW CLICKED:', policyId);
    this.router.navigate(['/customer/purchase', policyId]);
  }

  isPolicyPurchased(policyId: string): boolean {
    return this.purchasedPolicyIds.has(policyId);
  }
}
