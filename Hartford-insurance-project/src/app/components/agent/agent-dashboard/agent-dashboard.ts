import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentService } from '../../../../services/agent.service';
import { Router } from '@angular/router';
import { Claims } from '../../../../services/claims';
import { Auth } from '../../../../auth/services/auth';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agent-dashboard.html',
  styleUrl: './agent-dashboard.css'
})
export class AgentDashboard implements OnInit {
  agent: any;
  assignedCustomers: any[] = [];
  customerCount = 0;
  pendingClaimsCount = 0;
  totalCommission = 0;
  policiesSold = 0; // Derived from customer policies

  constructor(
    private agentService: AgentService,
    private claimsService: Claims,
    private auth: Auth,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.auth.getUser();
    
    // 1. Get Agent Details
    this.agentService.getAgentByUserId(user.id).subscribe(agents => {
      if (agents.length === 0) return;
      this.agent = agents[0];

      // 2. Get Assigned Customers
      if (this.agent.assignedCustomerIds && this.agent.assignedCustomerIds.length > 0) {
        this.agentService.getCustomersByIds(this.agent.assignedCustomerIds).subscribe(customers => {
            this.assignedCustomers = customers;
            this.customerCount = customers.length;
            
            // Calculate policies sold
            this.policiesSold = customers.reduce((sum: number, c: any) => sum + (c.policyIds?.length || 0), 0);
            
            // Calculate total commission
            this.calculateTotalCommission(customers);

            this.cd.detectChanges();

            // 3. Get Claims (to count pending)
            const customerIds = customers.map((c:any) => c.id);
            this.agentService.getClaimsByCustomerIds(customerIds).subscribe(claims => {
                this.pendingClaimsCount = claims.filter((c:any) => c.status === 'Pending').length;
                this.cd.detectChanges();
            });
        });
      }
    });
  }

  calculateTotalCommission(customers: any[]) {
    if (!this.agent || !customers.length) return;
    
    const rate = this.agent.commissionRate || 0;
    let totalPremiums = 0;

    this.claimsService.getPolicies((allPolicies: any[]) => {
      customers.forEach(cust => {
        if (cust.policyIds) {
          cust.policyIds.forEach((pid: any) => {
            const policy = allPolicies.find(p => p.id == pid);
            if (policy) {
              totalPremiums += (Number(policy.premium) || 0);
            }
          });
        }
      });
      this.totalCommission = (totalPremiums * rate) / 100;
      this.cd.detectChanges();
    });
  }

  viewCustomers() {
    this.router.navigate(['/agent/customers']);
  }

  viewCommunication() {
      this.router.navigate(['/agent/communication']);
  }

  contactCustomer(customerId: number) {
      this.router.navigate(['/agent/communication'], { queryParams: { customerId: customerId } });
  }
}
