import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgentService } from '../../../services/agent.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-communication-log',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './communication-log.html',
  styleUrl: './communication-log.css'
})
export class CommunicationLog implements OnInit {
  communications: any[] = [];
  assignedCustomers: any[] = [];
  agentId!: number;

  selectedCustomerId: number | null = null;
  message: string = '';
  communicationType: string = 'Email'; // Default
  
  communicationTypes = ['Email', 'Phone', 'SMS', 'In-Person', 'Video Call'];

  constructor(
    private agentService: AgentService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user')!);
    
    this.agentService.getAgentByUserId(user.id).subscribe(agents => {
        if (agents.length === 0) return;
        const agent = agents[0];
        this.agentId = agent.id;

        if (agent.assignedCustomerIds?.length) {
            this.agentService.getCustomersByIds(agent.assignedCustomerIds).subscribe(customers => {
                this.assignedCustomers = customers;
                
                // Check query param for pre-selection
                const preSelectedId = this.route.snapshot.queryParamMap.get('customerId');
                if (preSelectedId) {
                    this.selectedCustomerId = +preSelectedId;
                    this.updateTypeBasedOnPreference();
                }

                this.cd.detectChanges();
            });
        }

        this.loadCommunications();
    });
  }

  loadCommunications() {
      this.agentService.getCommunications(this.agentId).subscribe(comms => {
          this.communications = comms.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          this.cd.detectChanges();
      });
  }

  getCustomerName(id: number): string {
      const customer = this.assignedCustomers.find(c => c.id == id);
      return customer ? customer.fullName : `Customer #${id}`;
  }

  updateTypeBasedOnPreference() {
      if (this.selectedCustomerId) {
          const customer = this.assignedCustomers.find(c => c.id == this.selectedCustomerId);
          if (customer && customer.communicationPreference) {
              const pref = customer.communicationPreference.toLowerCase();
              
              // Find matching type ignoring case
              const matchedType = this.communicationTypes.find(t => t.toLowerCase() === pref);
              
              if (matchedType) {
                  this.communicationType = matchedType;
              } else if (pref.includes('call') || pref.includes('phone')) {
                  this.communicationType = 'Phone';
              } else if (pref.includes('mail')) {
                  this.communicationType = 'Email';
              } else if (pref.includes('text') || pref.includes('sms')) {
                  this.communicationType = 'SMS';
              }
          }
      }
  }

  logCommunication() {
      if (!this.selectedCustomerId || !this.message) {
          alert("Please select a customer and enter a message.");
          return;
      }

      const newComm = {
          agentId: this.agentId,
          customerId: this.selectedCustomerId,
          date: new Date().toISOString().slice(0, 10),
          type: this.communicationType,
          message: this.message
      };

      this.agentService.addCommunication(newComm).subscribe(() => {
          alert("Communication logged successfully!");
          this.message = '';
          // We keep the customer selected as they might log more, or clear it? 
          // User said "move to the commnunication log page", implies flow.
          // Let's clear message but keep customer.
          this.loadCommunications();
      });
  }
}
