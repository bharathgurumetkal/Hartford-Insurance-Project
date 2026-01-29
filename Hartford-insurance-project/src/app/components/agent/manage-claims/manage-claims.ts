import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgentService } from '../../../../services/agent.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-manage-claims',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-claims.html',
  styleUrl: './manage-claims.css'
})
export class ManageClaims implements OnInit {
  claims: any[] = [];
  agentId!: number;
  filteredCustomerName: string = '';
  
  viewClaimModalOpen = false;
  selectedClaim: any = null;

  constructor(
    private agentService: AgentService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

ngOnInit() {
  const user = JSON.parse(localStorage.getItem('user')!);

  this.agentService.getAgentByUserId(user.id).subscribe(agents => {
    if (agents.length === 0) return;

    this.agentId = agents[0].id;

    // Load immediately
    this.loadClaims();

    // 👇 Ensure UI updates correctly
    this.cd.detectChanges();
  });
}


loadClaims() {
  this.agentService.getClaimsByAgentId(this.agentId).subscribe(claims => {
    this.claims = claims;

    const customerIdParam = this.route.snapshot.queryParamMap.get('customerId');
    if (customerIdParam) {
      this.claims = this.claims.filter(c => c.customerId == customerIdParam);
    }
  });
}


  updateStatus(claim: any, newStatus: string) {
  const remark = prompt("Add a remark:", claim.adminRemark || "");
  if (remark === null) return;

  const claimId = Number(claim.id); // Ensure numeric ID
  const updatedClaim = {
    ...claim,
    status: newStatus,
    adminRemark: remark
  };

  console.log(`Updating claim ${claimId} via ManageClaims...`);

  this.agentService.updateClaimStatus(claimId, updatedClaim)
    .subscribe({
      next: () => {
        alert(`Claim successfully updated to ${newStatus}`);
        this.loadClaims();
        this.closeViewModal();
      },
      error: (err) => {
        console.error("Update failed:", err);
        alert(`Error ${err.status}: ${err.message || 'Could not update claim.'}`);
      }
    });
}


  openViewModal(claim: any) {
      this.selectedClaim = claim;
      this.viewClaimModalOpen = true;
  }

  closeViewModal() {
      this.viewClaimModalOpen = false;
      this.selectedClaim = null;
  }
}
