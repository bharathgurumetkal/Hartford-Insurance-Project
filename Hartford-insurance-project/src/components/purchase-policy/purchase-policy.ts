import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseService } from '../../services/purchase.service';
import { PolicyService } from '../../services/policy-service';
import { PurchasedPolicyService } from '../../services/purchased-policy.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-purchase-policy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './purchase-policy.html',
  styleUrl: './purchase-policy.css'
})
export class PurchasePolicyComponent implements OnInit {

  policy: any = null;
  loading = true;
  success = false;
  error = '';

  form = {
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    age: 0,
    address: '',
    city: '',
    state: '',
    pincode: '',

    // Nominee Information
    nomineeName: '',
    nomineeRelation: '',
    nomineeAge: 0,

    // Payment
    paymentMode: 'Yearly',

    // Terms
    termsAccepted: false
  };

  calculatedPremium = 0;
  kycDocuments: File[] = [];
  kycFileNames: string[] = [];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private policyService: PolicyService,
    private purchaseService: PurchaseService,
    private purchasedPolicyService: PurchasedPolicyService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const policyId = params.get('policyId');
      console.log('=== PURCHASE POLICY COMPONENT ===');
      console.log('Route policyId:', policyId);

      if (!policyId) {
        console.error('No policy ID in route');
        this.error = 'No policy ID provided';
        this.loading = false;
        this.policy = null;
        this.cdr.detectChanges(); // Force change detection
        return;
      }

      // Reset state
      this.loading = true;
      this.policy = null;
      this.error = '';
      this.cdr.detectChanges(); // Force change detection
      console.log('Loading state set to TRUE, fetching policy...');

      // Use PolicyService to get the policy by ID
      this.policyService.getPolicyById(policyId).subscribe({
        next: (policy) => {
          console.log('API Response received:', policy);
          console.log('Policy object:', JSON.stringify(policy, null, 2));

          if (policy && policy.id) {
            this.policy = policy;
            this.calculatedPremium = policy.premium;
            this.loading = false;
            this.cdr.detectChanges(); // Force change detection
            console.log('✓ Policy loaded successfully');
            console.log('Loading state set to FALSE');
            console.log('Policy name:', this.policy.name);
          } else {
            this.policy = null;
            this.error = 'Policy not found';
            this.loading = false;
            this.cdr.detectChanges(); // Force change detection
            console.error('✗ Policy data is invalid or empty');
          }
        },
        error: (err) => {
          console.error('✗ API Error:', err);
          console.error('Error details:', JSON.stringify(err, null, 2));
          this.error = 'Failed to load policy details. Please ensure the backend server is running on port 3000.';
          this.policy = null;
          this.loading = false;
          this.cdr.detectChanges(); // Force change detection
          console.log('Loading state set to FALSE (error case)');
        },
        complete: () => {
          console.log('Observable completed');
          console.log('Final state - loading:', this.loading, 'policy:', !!this.policy, 'error:', this.error);
        }
      });
    });
  }

  calculateAge(): void {
    if (this.form.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(this.form.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      this.form.age = age;
      this.calculatePremium();
    }
  }

  calculatePremium(): void {
    if (this.policy) {
      this.calculatedPremium = this.purchaseService.calculatePremium(
        this.policy.premium,
        this.form.paymentMode,
        this.form.age > 0 ? this.form.age : undefined
      );
    }
  }

  onKycSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        this.kycDocuments.push(file);
        this.kycFileNames.push(file.name);
      }
      console.log('KYC FILES:', this.kycFileNames);
    }
  }

  removeDocument(index: number): void {
    this.kycDocuments.splice(index, 1);
    this.kycFileNames.splice(index, 1);
  }

  confirmPurchase(): void {
    this.error = '';

    // Validation
    if (!this.form.fullName || !this.form.email || !this.form.phone) {
      this.error = 'Please fill in all required personal information';
      return;
    }

    if (!this.form.nomineeName || !this.form.nomineeRelation) {
      this.error = 'Please fill in nominee information';
      return;
    }

    if (this.kycDocuments.length === 0) {
      this.error = 'Please upload at least one KYC document';
      return;
    }

    if (!this.form.termsAccepted) {
      this.error = 'Please accept the terms and conditions';
      return;
    }

    // Create purchased policy object
    const purchasedPolicy = {
      id: `POL-${Date.now()}`,
      policyId: this.policy.id,
      policyName: this.policy.name,
      policyType: this.policy.type,
      premium: this.policy.premium,
      coverage: this.policy.coverage,
      durationDays: this.policy.durationDays,
      description: this.policy.description,
      features: this.policy.features,

      // Personal Info
      fullName: this.form.fullName,
      email: this.form.email,
      phone: this.form.phone,
      dateOfBirth: this.form.dateOfBirth,
      age: this.form.age,
      address: this.form.address,
      city: this.form.city,
      state: this.form.state,
      pincode: this.form.pincode,

      // Nominee Info
      nomineeName: this.form.nomineeName,
      nomineeRelation: this.form.nomineeRelation,
      nomineeAge: this.form.nomineeAge,

      // Payment
      paymentMode: this.form.paymentMode as 'Monthly' | 'Yearly',
      calculatedPremium: this.calculatedPremium,

      // Metadata
      purchaseDate: new Date().toISOString().split('T')[0],
      status: 'Active' as const,
      customerId: this.authService.getCurrentCustomerId() // Add customer ID
    };

    // Save to purchased policy service
    this.purchasedPolicyService.addPurchasedPolicy(purchasedPolicy);

    console.log('✓ Policy purchased successfully:', purchasedPolicy);

    // Navigate to success page
    this.router.navigate(['/customer/purchase-success']);
  }
}
