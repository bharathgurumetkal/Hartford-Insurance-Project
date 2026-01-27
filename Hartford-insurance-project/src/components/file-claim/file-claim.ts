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

  damageCost: number | null = null;
calculatedAmount: number | null = null;

  uploadedFiles: File[] = [];
  uploadedFileNames: string[] = [];

  customerId!: number;

  constructor(
    private claimsService: Claims,
    private documentsService: DocumentsService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Load policies
    this.claimsService.getPolicies((policies)=>{
      this.policies = policies;
      this.cd.detectChanges();
    });

    // Get logged-in customer
    const user = JSON.parse(localStorage.getItem('user')!);

    this.claimsService.getCustomerByUserId(user.id,(customer)=>{
      this.customerId = customer.id;
      this.cd.detectChanges();
    });
  }

    calculateClaimAmount() {
  if (this.selectedPolicy && this.damageCost != null) {
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

    const policy = this.policies.find(p=>p.id == this.selectedPolicyId);

    const newClaim = {
      policyId: this.selectedPolicyId,
      customerId: this.customerId,
      claimId: "CLM-" + Math.floor(1000 + Math.random()*9000),
      policyName: policy?.name,
      type: policy?.type,
      date: new Date().toISOString().slice(0,10),
      amount: this.amount,
      description:this.description,
      status: "Pending",
      adminRemark: "Under Review",

      // ✅ filenames stored only
      documents: this.uploadedFileNames,

      timeline: [
        {
          status: "Submitted",
          message: "Claim submitted successfully",
          date: new Date().toISOString().slice(0,10)
        }
      ]
    };

    // Save to JSON Server
    this.claimsService.fileClaim(newClaim, (res) => {
      
      // Save documents to db.json
      this.uploadedFileNames.forEach(fileName => {
        const doc = {
          customerId: this.customerId,
          documentType: "Claim Document", // Generic type for now
          fileName: fileName,
          expiryDate: "N/A", // Not applicable for claim docs usually
          uploadDate: new Date().toISOString().slice(0, 10)
        };
        this.documentsService.addDocument(doc, () => {});
      });

      alert("Claim Filed Successfully!");
      this.closeModal.emit();
      this.cd.detectChanges();
    });
  }
  
}
