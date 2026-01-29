import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agent-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agent-details.html',
})
export class AgentDetails {
  @Input() agent: any;
  @Input() customers: any[] = [];
  @Input() policies: any[] = [];

  get assignedCustomers() {
    return this.customers.filter(c =>
      this.agent.assignedCustomerIds?.includes(c.id)
    );
  }

  get policyCount() {
    return this.assignedCustomers.reduce(
      (sum, c) => sum + (c.policyIds?.length || 0),
      0
    );
  }
}
