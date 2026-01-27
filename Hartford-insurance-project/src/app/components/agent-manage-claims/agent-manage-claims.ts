import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ClaimsAgent } from '../../../services/claims-agent';
import { Auth } from '../../../auth/services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { AgentService } from '../../../services/agent.service';

@Component({
  selector: 'app-agent-manage-claims',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './agent-manage-claims.html',
  styleUrl: './agent-manage-claims.css',
})
export class AgentManageClaims implements OnInit {
  agent: any;
  allClaims: any[] = []; // Store original list
  claims: any[] = [];
  selectedClaim: any = null;
  newRemark = '';
  
  // UI Enhancements
  isUpdating = false;
  toast: { message: string, type: 'success' | 'error' } | null = null;

  constructor(
    private claimsAgentService: ClaimsAgent,
    private agentService: AgentService,
    private auth: Auth,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.auth.getUser();

    // Get agent profile
    this.claimsAgentService.getAgentByUserId(user.id).subscribe(res => {
      this.agent = res[0];
      this.cd.detectChanges();

      // Fetch claims assigned to agent
      this.claimsAgentService.getClaimsByAgent(this.agent.id).subscribe(claims => {
        this.allClaims = claims;
        this.applyFilters();
        this.cd.detectChanges();
      });
    });
  }

  applyFilters() {
    const customerId = this.route.snapshot.queryParamMap.get('customerId');
    if (customerId) {
        this.claims = this.allClaims.filter(c => c.customerId == customerId);
    } else {
        this.claims = [...this.allClaims];
    }
  }

  openClaim(claim: any) {
    this.selectedClaim = claim;
    // Pre-populate remark if it exists
    this.newRemark = claim.adminRemark || '';
  }

  closeModal() {
    this.selectedClaim = null;
    this.newRemark = '';
  }

  updateStatus(status: string) {
    if (!this.selectedClaim || this.isUpdating) return;

    this.isUpdating = true;
    const claimId = this.selectedClaim.id; // Use ID as is (string from db.json)
    const patchData: any = { status };

    if (this.newRemark.trim()) {
      patchData.adminRemark = this.newRemark;
    }

    this.agentService.updateClaimStatus(claimId, patchData)
      .subscribe({
        next: (res) => {
          this.isUpdating = false;
          // Update items in UI
          this.selectedClaim.status = status;
          this.selectedClaim.adminRemark = this.newRemark;

          // Helper to update locally
          const updateLocal = (arr: any[]) => {
              const idx = arr.findIndex(c => c.id == claimId);
              if (idx !== -1) {
                  arr[idx].status = status;
                  arr[idx].adminRemark = this.newRemark;
              }
          };

          updateLocal(this.allClaims);
          updateLocal(this.claims);

          this.cd.detectChanges();
          this.showToast(`Claim successfully ${status.toLowerCase()}`, 'success');
          
          // Delay closing to let user see status change
          setTimeout(() => this.closeModal(), 1500);
        },
        error: (err) => {
          this.isUpdating = false;
          console.error("Update failed:", err);
          const msg = err.status === 404 ? 'Resource not found on server.' : (err.message || 'Server error.');
          this.showToast(`Update failed: ${msg}`, 'error');
        }
      });
  }

  showToast(message: string, type: 'success' | 'error') {
    this.toast = { message, type };
    this.cd.detectChanges();
    setTimeout(() => {
        this.toast = null;
        this.cd.detectChanges();
    }, 4000);
  }
}
