import { ChangeDetectorRef, Component } from '@angular/core';
import { StatCardComponent } from '../../app/components/stat-card/stat-card';
import { DataTable } from '../../app/components/data-table/data-table';
import { Claim } from '../../models/claim';
import { CommonModule } from '@angular/common';
import { Auth } from '../../auth/services/auth';

@Component({
  selector: 'app-claim-review',
  standalone: true,
  imports: [StatCardComponent, DataTable,CommonModule],
  templateUrl: './claim-review.html',
})
export class ClaimReview {

  claims: Claim[] = [];

  pendingClaims = 0;
  approvedClaims = 0;
  rejectedClaims = 0;

  
  tableColumns: string[] = [
    'Claim ID',
    'Policy ID',
    'Policy Name',
    'Customer Name',
    'Amount',
    'Status',
    'Submitted Date',
   
  ];


  tableKeys: string[] = [
    'id',
    'policyId',
    'policyName',
    'customerName',
    'amount',
    'status',
    'date'
  ];

  constructor(
    private api: Auth,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.api.getClaims().subscribe((data: any) => {
      this.claims = data;
      this.calculateStats();
      this.cdr.detectChanges();
      console.log(this.claims)
    });
  }

  private calculateStats(): void {
    this.pendingClaims = this.claims.filter(c => c.status === 'Pending').length;
    this.approvedClaims = this.claims.filter(c => c.status === 'Approved').length;
    this.rejectedClaims = this.claims.filter(c => c.status === 'Rejected').length;
  }

  selectedClaim: Claim | null = null;
isModalOpen = false;

viewClaim(claim: Claim): void {
  console.log('Selected claim:', claim);
  this.selectedClaim = claim;
  this.isModalOpen = true;
}

closeModal(): void {
  this.isModalOpen = false;
  this.selectedClaim = null;
}

approveClaim(claim: Claim): void {
  if (claim.status !== 'Pending') return;

  this.api.updateClaimStatus(claim.id, 'Approved')
    .subscribe(updatedClaim => {

      // update local state after DB update
      claim.status = 'Approved';

      this.calculateStats();
      this.cdr.detectChanges();
    });
}


  rejectClaim(claim: Claim): void {
  if (claim.status !== 'Pending') return;

  const confirmed = confirm(`Reject claim ${claim.id}?`);
  if (!confirmed) return;

  this.api.updateClaimStatus(claim.id, 'Rejected')
    .subscribe(updatedClaim => {

      claim.status = 'Rejected';

      this.calculateStats();
      this.cdr.detectChanges();
    });
}

}
