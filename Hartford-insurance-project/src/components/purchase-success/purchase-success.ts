import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PurchasedPolicyService, PurchasedPolicy } from '../../services/purchased-policy.service';

@Component({
    selector: 'app-purchase-success',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './purchase-success.html',
    styleUrl: './purchase-success.css'
})
export class PurchaseSuccessComponent implements OnInit {
    latestPurchase: PurchasedPolicy | null = null;

    constructor(
        private router: Router,
        private purchasedPolicyService: PurchasedPolicyService
    ) { }

    ngOnInit(): void {
        // Get the most recently purchased policy
        const allPurchases = this.purchasedPolicyService.getPurchasedPolicies();
        if (allPurchases.length > 0) {
            this.latestPurchase = allPurchases[allPurchases.length - 1];
        } else {
            // If no purchases found, redirect to browse policies
            this.router.navigate(['/customer/policies']);
        }
    }

    viewMyPolicies(): void {
        this.router.navigate(['/customer/my-policies']);
    }

    browsePolicies(): void {
        this.router.navigate(['/customer/policies']);
    }
}
