import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface PurchasedPolicy {
    id: string;
    policyId: string;
    policyName: string;
    policyType: string;
    premium: number;
    coverage: number;
    durationDays: number;
    description: string;
    features?: string[];

    // Purchase details
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth?: string;
    age?: number;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;

    // Nominee
    nomineeName: string;
    nomineeRelation: string;
    nomineeAge?: number;

    // Payment
    paymentMode: 'Monthly' | 'Yearly';
    calculatedPremium: number;

    // Metadata
    purchaseDate: string;
    status: 'Active' | 'Pending' | 'Expired';
    customerId: string; // Customer who purchased this policy
}

@Injectable({
    providedIn: 'root'
})
export class PurchasedPolicyService {
    private readonly STORAGE_KEY = 'purchased_policies_all'; // Store all customers' policies
    private purchasedPoliciesSubject = new BehaviorSubject<PurchasedPolicy[]>([]);

    public purchasedPolicies$: Observable<PurchasedPolicy[]> = this.purchasedPoliciesSubject.asObservable();

    constructor(private authService: AuthService) {
        this.loadFromStorage();
    }

    /**
     * Get storage key for all policies (shared across customers)
     */
    private getStorageKey(): string {
        return this.STORAGE_KEY;
    }

    /**
     * Load purchased policies from localStorage and filter by current customer
     */
    private loadFromStorage(): void {
        try {
            const currentCustomerId = this.authService.getCurrentCustomerId();
            const stored = localStorage.getItem(this.getStorageKey());

            if (stored) {
                const allPolicies: PurchasedPolicy[] = JSON.parse(stored);
                // Filter to only show current customer's policies
                const customerPolicies = allPolicies.filter(p => p.customerId === currentCustomerId);
                this.purchasedPoliciesSubject.next(customerPolicies);
                console.log(`Loaded ${customerPolicies.length} policies for customer ${currentCustomerId}`);
            } else {
                this.purchasedPoliciesSubject.next([]);
            }
        } catch (error) {
            console.error('Error loading purchased policies from storage:', error);
            this.purchasedPoliciesSubject.next([]);
        }
    }

    /**
     * Save purchased policies to localStorage (all customers)
     */
    private saveToStorage(allPolicies: PurchasedPolicy[]): void {
        try {
            localStorage.setItem(this.getStorageKey(), JSON.stringify(allPolicies));
            console.log('Saved all purchased policies to storage:', allPolicies.length);
        } catch (error) {
            console.error('Error saving purchased policies to storage:', error);
        }
    }

    /**
     * Get all policies from storage (across all customers)
     */
    private getAllPoliciesFromStorage(): PurchasedPolicy[] {
        try {
            const stored = localStorage.getItem(this.getStorageKey());
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error reading all policies from storage:', error);
            return [];
        }
    }

    /**
     * Add a new purchased policy for the current customer
     */
    addPurchasedPolicy(policy: PurchasedPolicy): void {
        // Get all policies from storage (all customers)
        const allPolicies = this.getAllPoliciesFromStorage();

        // Add the new policy to all policies
        const updatedAllPolicies = [...allPolicies, policy];

        // Save all policies back to storage
        this.saveToStorage(updatedAllPolicies);

        // Update the observable with current customer's policies only
        const currentCustomerId = this.authService.getCurrentCustomerId();
        const customerPolicies = updatedAllPolicies.filter(p => p.customerId === currentCustomerId);
        this.purchasedPoliciesSubject.next(customerPolicies);

        console.log(`Added purchased policy for customer ${currentCustomerId}:`, policy.policyName);
    }

    /**
     * Get all purchased policies
     */
    getPurchasedPolicies(): PurchasedPolicy[] {
        return this.purchasedPoliciesSubject.value;
    }

    /**
     * Get purchased policies as observable
     */
    getPurchasedPolicies$(): Observable<PurchasedPolicy[]> {
        return this.purchasedPolicies$;
    }

    /**
     * Get a specific purchased policy by ID
     */
    getPurchasedPolicyById(id: string): PurchasedPolicy | undefined {
        return this.purchasedPoliciesSubject.value.find(p => p.id === id);
    }

    /**
     * Check if a policy has been purchased by the current customer
     */
    isPolicyPurchased(policyId: string): boolean {
        const currentCustomerId = this.authService.getCurrentCustomerId();
        return this.purchasedPoliciesSubject.value.some(
            p => p.policyId === policyId && p.customerId === currentCustomerId
        );
    }

    /**
     * Get count of active policies
     */
    getActiveCount(): number {
        return this.purchasedPoliciesSubject.value.filter(p => p.status === 'Active').length;
    }

    /**
     * Calculate total monthly premium
     */
    getTotalMonthlyPremium(): number {
        return this.purchasedPoliciesSubject.value.reduce((total, policy) => {
            const monthlyPremium = policy.paymentMode === 'Monthly'
                ? policy.calculatedPremium
                : policy.calculatedPremium / 12;
            return total + monthlyPremium;
        }, 0);
    }

    /**
     * Calculate total yearly premium
     */
    getTotalYearlyPremium(): number {
        return this.purchasedPoliciesSubject.value.reduce((total, policy) => {
            const yearlyPremium = policy.paymentMode === 'Yearly'
                ? policy.calculatedPremium
                : policy.calculatedPremium * 12;
            return total + yearlyPremium;
        }, 0);
    }

    /**
     * Get total coverage amount
     */
    getTotalCoverage(): number {
        return this.purchasedPoliciesSubject.value.reduce((total, policy) => {
            return total + policy.coverage;
        }, 0);
    }

    /**
     * Clear all purchased policies (for testing)
     */
    clearAll(): void {
        this.purchasedPoliciesSubject.next([]);
        localStorage.removeItem(this.getStorageKey());
        console.log('Cleared all purchased policies');
    }

    /**
     * Clear policies for a specific customer
     */
    clearCustomerPolicies(customerId: string): void {
        const allPolicies = this.getAllPoliciesFromStorage();
        const remainingPolicies = allPolicies.filter(p => p.customerId !== customerId);

        this.saveToStorage(remainingPolicies);

        // If clearing current customer's policies, update the observable
        const currentCustomerId = this.authService.getCurrentCustomerId();
        if (customerId === currentCustomerId) {
            this.purchasedPoliciesSubject.next([]);
        }

        console.log(`Cleared policies for customer ${customerId}`);
    }
}
