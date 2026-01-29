import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentService } from '../../../../services/agent.service';
import { Claims } from '../../../../services/claims'; // reusing to fetch policies

@Component({
  selector: 'app-commissions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './commissions.html',
  styleUrl: './commissions.css'
})
export class Commissions implements OnInit {
  agent: any;
  totalCommission = 0;
  commissionBreakdown: any[] = [];
  isLoading = true;

  constructor(
    private agentService: AgentService,
    private claimsService: Claims,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user')!);
    
    this.agentService.getAgentByUserId(user.id).subscribe(agents => {
        if (agents.length === 0) return;
        this.agent = agents[0];
        this.calculateCommissions();
    });
  }

  calculateCommissions() {
      if (!this.agent.assignedCustomerIds || this.agent.assignedCustomerIds.length === 0) {
          this.isLoading = false;
          return;
      }

      // Fetch all needed data
      // 1. Customers
      this.agentService.getCustomersByIds(this.agent.assignedCustomerIds).subscribe(customers => {
          
          // 2. Policies (all available types)
          this.claimsService.getPolicies((allPolicies) => {
              
              this.commissionBreakdown = [];
              this.totalCommission = 0;

              customers.forEach(customer => {
                  if (customer.policyIds) {
                      customer.policyIds.forEach((pid: number) => {
                          const policy = allPolicies.find(p => p.id == pid);
                          if (policy) {
                               const commissionAmount = (policy.premium * this.agent.commissionRate) / 100;
                               this.totalCommission += commissionAmount;
                               
                               this.commissionBreakdown.push({
                                   customerName: customer.fullName,
                                   policyName: policy.name,
                                   premium: policy.premium,
                                   rate: this.agent.commissionRate,
                                   commission: commissionAmount
                               });
                          }
                      });
                  }
              });
              
              this.isLoading = false;
              this.cd.detectChanges();
          });
      });
  }
}
