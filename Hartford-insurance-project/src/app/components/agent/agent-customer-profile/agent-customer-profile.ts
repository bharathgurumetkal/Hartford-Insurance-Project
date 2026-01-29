import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AgentService } from '../../../../services/agent.service';
import { Claims } from '../../../../services/claims';
import { DocumentsService } from '../../../../services/documents';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-agent-customer-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './agent-customer-profile.html',
  styleUrl: './agent-customer-profile.css'
})
export class AgentCustomerProfile implements OnInit {
  customer: any;
  policies: any[] = [];
  documents: any[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private agentService: AgentService,
    private claimsService: Claims,
    private documentsService: DocumentsService,
    private router: Router,
    private cd:ChangeDetectorRef
  ) {}

  ngOnInit() {
    const customerId = this.route.snapshot.paramMap.get('id');
    if (customerId) {
        // Fetch customer details
        this.agentService.getCustomersByIds([customerId]).subscribe(customers => {
            if (customers.length > 0) {
                this.customer = customers[0];
                this.loadPolicies();
                this.loadDocuments();
                this.cd.detectChanges();
            }
        });
    }
  }

  loadDocuments() {
      this.documentsService.getDocumentsByCustomerId(this.customer.id, (docs) => {
          this.documents = docs;
          this.cd.detectChanges()
      });
  }

  loadPolicies() {
      // We need to fetch policy details based on policyIds
      if (this.customer.policyIds && this.customer.policyIds.length > 0) {
          this.claimsService.getPolicies((allPolicies) => {
              // Ensure we match using loose equality or string casting
              this.policies = allPolicies.filter(p => this.customer.policyIds.some((id: any) => id == p.id));
              this.isLoading = false;
              this.cd.detectChanges()
          });
      } else {
          this.isLoading = false;
      }
  }

  viewClaims() {
      // Navigate to claims filtered by this customer
      // or implement a specific route. For now, let's go to the main claims page 
      // where we might implement filtering later, or just show a message.
      // Better: navigate to ManageClaims with a query param
      this.router.navigate(['/agent/claims'], { queryParams: { customerId: this.customer.id } });
  }
}
