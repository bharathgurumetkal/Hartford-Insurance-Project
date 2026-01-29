import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentService } from '../../../../services/agent.service';
import { Router } from '@angular/router';
import { Auth } from '../../../../auth/services/auth';

@Component({
  selector: 'app-assigned-customers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assigned-customers.html',
  styleUrl: './assigned-customers.css'
})
export class AssignedCustomers implements OnInit {
  customers: any[] = [];
  agentId!: any;

  constructor(
    private agentService: AgentService,
    private auth: Auth,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.auth.getUser();
    
    this.agentService.getAgentByUserId(user.id).subscribe(agents => {
      if (agents.length === 0) return;
      const agent = agents[0];
      this.agentId = agent.id;

      if (agent.assignedCustomerIds?.length) {
        this.agentService.getCustomersByIds(agent.assignedCustomerIds).subscribe(customers => {
          this.customers = customers;
          this.cd.detectChanges();
        });
      }
    });
  }

  viewProfile(customerId: number) {
    this.router.navigate(['/agent/customer', customerId]);
  }
}
