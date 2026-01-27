import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaimsAgent } from '../../../services/claims-agent';
import { Auth } from '../../../auth/services/auth';
import { RouterLink } from '@angular/router';
import { AgentService } from '../../../services/agent.service';
import { Claims } from '../../../services/claims';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agent-profile',
  standalone: true,
  imports: [CommonModule, RouterLink,FormsModule],
  templateUrl: './agent-profile.html',
  styleUrl: './agent-profile.css',
})
export class AgentProfile implements OnInit {
  agent: any = null;
  user: any = null;
  
  // Real Data
  activeCustomers = 0;
  totalCommission = 0;
  commissionRate = 0;
  
  // Edit State
  isEditing = false;
  isSaving = false;
  editFormData = {
      phone: '',
      address: ''
  };

  // UI Improvements
  toast: { message: string, type: 'success' | 'error' } | null = null;

  // Verification Checks
  kycSteps = [
      { name: 'Identity Verified', status: true },
      { name: 'Address Verified', status: true },
      { name: 'Phone Verified', status: true }
  ];

  constructor(
    private claimsAgentService: ClaimsAgent,
    private agentService: AgentService,
    private claimsService: Claims,
    private auth: Auth,
    private cd:ChangeDetectorRef  
  ) {}

  ngOnInit() {
    this.user = this.auth.getUser();
    
    if (this.user) {
        this.loadAgentProfile();
    }
  }

  loadAgentProfile() {
    this.claimsAgentService.getAgentByUserId(this.user.id).subscribe(res => {
        if (res.length > 0) {
            this.agent = res[0];
            this.activeCustomers = this.agent.assignedCustomerIds?.length || 0;
            this.commissionRate = this.agent.commissionRate || 0;
            
            // Sync form data
            this.editFormData.phone = this.agent.phone || '';
            this.editFormData.address = this.agent.address || '';

            this.calculateCommission();
            this.cd.detectChanges();
        }
    });
  }

  toggleEdit() {
      this.isEditing = !this.isEditing;
      if (!this.isEditing) {
          // Reset form on cancel
          this.editFormData.phone = this.agent.phone || '';
          this.editFormData.address = this.agent.address || '';
      }
      this.cd.detectChanges();
  }

  saveProfile() {
      if (this.isSaving) return;
      this.isSaving = true;

      this.claimsAgentService.updateAgent(this.agent.id, this.editFormData).subscribe({
          next: () => {
              this.isSaving = false;
              this.isEditing = false;
              // Update local object
              this.agent.phone = this.editFormData.phone;
              this.agent.address = this.editFormData.address;

              this.showToast('Profile updated successfully!', 'success');
              this.cd.detectChanges();
          },
          error: (err) => {
              this.isSaving = false;
              console.error("Save failed:", err);
              this.showToast('Failed to update profile.', 'error');
              this.cd.detectChanges();
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

  calculateCommission() {
    if (!this.agent || !this.agent.assignedCustomerIds?.length) return;

    // Fetch all policies to calculate based on premiums
    this.agentService.getCustomersByIds(this.agent.assignedCustomerIds).subscribe(customers => {
        let totalPremiums = 0;
        
        this.claimsService.getPolicies((allPolicies: any[]) => {
            customers.forEach(cust => {
                if (cust.policyIds) {
                    cust.policyIds.forEach((pid: any) => {
                        // Use loose equality to match string IDs from db.json with any numeric refs
                        const policy = allPolicies.find(p => p.id == pid);
                        if (policy) {
                            totalPremiums += (Number(policy.premium) || 0);
                        }
                    });
                }
            });
            this.totalCommission = (totalPremiums * this.commissionRate) / 100;
            this.cd.detectChanges();
        });
    });
  }
}
