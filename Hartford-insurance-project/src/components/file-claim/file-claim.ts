import { Component, EventEmitter, Output, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Claims } from '../../services/claims';
import { DocumentsService } from '../../services/documents';

@Component({
  selector: 'app-file-claim',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './file-claim.html',
  styleUrl: './file-claim.css'
})
export class FileClaim implements OnInit {

  @Output() closeModal = new EventEmitter<void>();

  policies:any[] = [];
  selectedPolicyId:number | null = null;
  selectedPolicy:any=null

  claimType = '';
  amount:number | null = null;
  description = '';

damageCost: number = 0; 
calculatedAmount: number | null = null;

  uploadedFiles: File[] = [];
  uploadedFileNames: string[] = [];

  customerId!: number;
  hasNoPolicies: boolean = false;
  customerData: any = null;

  constructor(
    private claimsService: Claims,
    private documentsService: DocumentsService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Get logged-in customer
    const user = JSON.parse(localStorage.getItem('user')!);

    this.claimsService.getCustomerByUserId(user.id,(customer)=>{
      this.customerId = customer.id;
      this.customerData = customer;

      // Check if customer has any policies
      if (!customer.policyIds || customer.policyIds.length === 0) {
        this.hasNoPolicies = true;
        this.policies = [];
        this.cd.detectChanges();
        return;
      }

      // Load only customer's owned policies
      this.claimsService.getPoliciesByIds(customer.policyIds, (policies)=>{
        this.policies = policies;
        this.hasNoPolicies = false;
        this.cd.detectChanges();
      });
    });
  }

calculateClaimAmount() {
  if (this.selectedPolicy && this.damageCost > 0) {
    // Claim amount cannot exceed policy coverage
    this.calculatedAmount = Math.min(
      this.damageCost,
      this.selectedPolicy.coverage
    );
  } else {
    this.calculatedAmount = null;
  }
}


  onPolicyChange() {
    const policy = this.policies.find(p=>p.id == this.selectedPolicyId);
    this.claimType = policy?.type || '';
    this.selectedPolicy=policy;
    this.calculateClaimAmount();
  }
  

  onFileSelect(event:any) {
    this.uploadedFiles = Array.from(event.target.files);

    // Just store filenames (no backend)
    this.uploadedFileNames = this.uploadedFiles.map(f => f.name);
  }

submitClaim() {

  const policy = this.policies.find(p => p.id == this.selectedPolicyId);

  const newClaim = {
    id: crypto.randomUUID(), // ensure unique id
    policyId: this.selectedPolicyId,
    customerId: this.customerId,
    assignedAgentId: this.customerData?.assignedAgentId || null,
    claimId: "CLM-" + Math.floor(1000 + Math.random() * 9000),
    policyName: policy?.name,
    type: policy?.type,
    date: new Date().toISOString().slice(0, 10),

    // ✅ FIXED
    amount: this.calculatedAmount,

    description: this.description,
    status: "Pending",
    adminRemark: "Under Review",

    // ✅ Store filenames inside claim only
    documents: this.uploadedFileNames,

    timeline: [
      {
        status: "Submitted",
        message: "Claim submitted successfully",
        date: new Date().toISOString().slice(0, 10)
      }
    ]
  };

  // ✅ Only ONE POST
  this.claimsService.fileClaim(newClaim, () => {
    this.closeModal.emit();
    this.cd.detectChanges();
  });
}


  
}
