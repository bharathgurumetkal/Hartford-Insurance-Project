import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PurchasedPolicyService, PurchasedPolicy } from '../../services/purchased-policy.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-policies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-policies.html'
})
export class MyPoliciesComponent implements OnInit, OnDestroy {
  myPolicies: PurchasedPolicy[] = [];
  filteredPolicies: PurchasedPolicy[] = [];

  // Filter states
  searchQuery: string = '';
  selectedType: string = '';
  maxPremium: number = 100000;
  minCoverage: number = 0;

  // Dashboard stats
  activeCount = 0;
  monthlyPremium = 0;
  totalCoverageAmount = 0;
  renewalAlertsCount = 0;

  private subscription?: Subscription;

  constructor(
    private purchasedPolicyService: PurchasedPolicyService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.subscription = this.purchasedPolicyService.getPurchasedPolicies$().subscribe(policies => {
      this.myPolicies = policies;
      this.filteredPolicies = [...policies];
      this.updateStats();
      this.applyFilters();
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * UPDATE STATS
   * Calculate all dashboard statistics from current policies
   */
  updateStats(): void {
    console.log('=== UPDATE STATS CALLED ===');
    console.log('myPolicies:', this.myPolicies);
    console.log('myPolicies length:', this.myPolicies.length);

    this.activeCount = this.purchasedPolicyService.getActiveCount();
    this.monthlyPremium = this.purchasedPolicyService.getTotalMonthlyPremium();

    // Debug total coverage calculation
    console.log('Calculating total coverage...');
    this.totalCoverageAmount = this.myPolicies.reduce((acc, p) => {
      console.log(`Policy: ${p.policyName}, Coverage: ${p.coverage}, Accumulator: ${acc}`);
      return acc + (p.coverage || 0);
    }, 0);
    console.log('Total Coverage Amount:', this.totalCoverageAmount);

    // Logic for Renewal Alert Banner: Policies expiring in < 30 days
    this.renewalAlertsCount = this.myPolicies.filter(p => this.calculateDaysRemaining(p) <= 30).length;

    console.log('Dashboard Stats:', {
      activeCount: this.activeCount,
      monthlyPremium: this.monthlyPremium,
      totalCoverageAmount: this.totalCoverageAmount,
      renewalAlertsCount: this.renewalAlertsCount
    });
  }

  /**
   * DYNAMIC CALCULATIONS FOR CARDS
   */
  calculateDaysRemaining(policy: PurchasedPolicy): number {
    const today = new Date();
    const purchase = new Date(policy.purchaseDate);
    // Expiry = Purchase Date + duration in days
    const expiry = new Date(purchase.getTime() + (policy.durationDays * 24 * 60 * 60 * 1000));
    const diffTime = expiry.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  getProgressWidth(policy: PurchasedPolicy): number {
    const daysLeft = this.calculateDaysRemaining(policy);
    // Calculate how much time has passed (0% to 100%)
    const percentUsed = ((policy.durationDays - daysLeft) / policy.durationDays) * 100;
    return Math.min(100, Math.max(0, percentUsed));
  }

  getMonthlyPremium(policy: PurchasedPolicy): number {
    return policy.paymentMode === 'Monthly'
      ? policy.calculatedPremium
      : policy.calculatedPremium / 12;
  }

  /**
   * FILTERS
   */
  applyFilters(): void {
    const query = this.searchQuery.toLowerCase().trim();

    this.filteredPolicies = this.myPolicies.filter(p => {
      const matchesSearch = !query || p.policyName.toLowerCase().includes(query);
      const matchesType = !this.selectedType || p.policyType === this.selectedType;
      const matchesPremium = p.calculatedPremium <= this.maxPremium;
      const matchesCoverage = p.coverage >= this.minCoverage;

      return matchesSearch && matchesType && matchesPremium && matchesCoverage;
    });
    this.cdr.detectChanges();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedType = '';
    this.maxPremium = 100000;
    this.minCoverage = 0;
    this.applyFilters();
  }

  /**
   * Format coverage amount for display
   */
  formatCoverage(amount: number): string {
    console.log('formatCoverage called with:', amount);
    if (!amount || amount === 0) {
      return '0';
    }
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + 'M';
    }
    return amount.toLocaleString('en-IN');
  }
}