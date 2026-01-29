import {  ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../../auth/services/auth';
import { DataTable } from '../../app/components/data-table/data-table';
import { AddAgentModal } from '../add-agent-modal/add-agent-modal';
import { ConfirmModal } from '../confirm-modal/confirm-modal';
import { FormsModule } from '@angular/forms';
import { AgentDetails } from '../../app/components/agent-details/agent-details';

@Component({
  selector: 'app-agent-management',
  standalone: true,
  imports: [CommonModule, DataTable, AddAgentModal,ConfirmModal,FormsModule,AgentDetails],
  templateUrl: './agent-management.html',
})

export class AgentManagement {
search=""
  allAgents:any[]=[];
  agents: any[] = [];
  showAddModal = false;
  showConfirmModal = false;
  customers:any[]=[];
  customerId:string=''
  policies:any[]=[];
  selectedAgent:any=null;
  isModalOpen=false;
   selectedAgentStatus:any=null;
unassignedPolicies: any[] = [];
selectedPolicy: any = null;
selectedAgentForPolicy: string = '';
policyColumns = ['Policy ID', 'Policy Name', 'Customer','customerId', 'Premium'];
policyKeys = ['policyId', 'policyName', 'customerName','customerId', 'premium'];




  selectedAgentId: number | null = null;


  columns = ['Agent ID', 'Email', 'Commission', 'Status'];
  keys = ['id', 'email', 'commissionRate', 'status'];

  constructor(private api: Auth,private cdr:ChangeDetectorRef) {}

  ngOnInit() {
    this.loadAgents();
    this.api.getCustomers().subscribe((c:any)=>this.customers=c);
    this.api.getPolicies().subscribe((p:any)=>this.policies=p);
    this.api.getUnassignPolicies().subscribe((an: any) => {
  setTimeout(() => {
    this.unassignedPolicies = an
  .filter((pol:any) => pol.assignedAgent == null)
  .map((pol:any) => ({
    ...pol,
    customerName: pol.customer?.name || '—',
    customerId:pol.customer?.id || null
  }));

      this.cdr.detectChanges();
  });
});

    
  }

  loadAgents() {
    this.api.getAgents().subscribe((agents:any) => {
      this.allAgents=[...agents];
      this.agents=[...agents]
      this.cdr.detectChanges();
    
      
    });
  }


filterByPolicyCount(min: number) {
  this.agents = this.allAgents.filter(agent => {
    const assignedCustomers = this.customers.filter(c =>
      agent.assignedCustomerIds?.includes(c.id)
    );

    const policyCount = assignedCustomers.reduce(
      (sum, c) => sum + (c.policyIds?.length || 0),
      0
    );

    return policyCount >= min;
  });
}


  openDeleteModal(agentId: number) {
    this.selectedAgentId = agentId;
    this.showConfirmModal = true;
  }

  closeDeleteModel(){
    this.showConfirmModal=false;
    this.cdr.detectChanges();
  }

  confirmDelete() {
    if (this.selectedAgentId == null) return;

    this.api.deleteAgent(this.selectedAgentId).subscribe(() => {

      this.showConfirmModal=false;
      this.selectedAgentId=null;
      this.agents=this.agents.filter(agent=>agent.id!=this.selectedAgentId)

      this.cdr.detectChanges();

      this.loadAgents();
     
    });
  }

  openAddModal() {
    this.showAddModal = true;
  }


  openStatusModal(agent:number){
    this.selectedAgentStatus=agent;
  }

changeStatus(status: 'Active' | 'Inactive' | 'Pending') {
  if (!this.selectedAgentStatus) return;

  const agentId = this.selectedAgentStatus.id;

  this.api.updateAgentStatus(agentId, status).subscribe(() => {
  
    this.selectedAgentStatus.status = status;

    
    setTimeout(() => {
      this.closeStatusModal();
      this.cdr.detectChanges();
    });
  });
}



  closeStatusModal(){
    this.selectedAgentStatus=null
  }

  openModal(){
    this.isModalOpen=true;
    
  }

  closeModal(){
    this.isModalOpen=false;
  }

  onAgentAdded() {
    this.showAddModal = false;
    this.loadAgents();
  }

  searchAgent(){
    const searchTerm=this.search.toLowerCase().trim();
    if(!searchTerm){
      this.agents=this.allAgents;
      return;
    }

    this.agents=this.allAgents.filter(agent=>
      agent.email?.toLowerCase().includes(searchTerm)||
      agent.id?.toLowerCase().includes(searchTerm)
    )
    
  }

  updateStatus(agent: any, status: 'Active' | 'Inactive' | 'Pending') {
  if (agent.status === status) return;

  this.api.updateAgentStatus(agent.id, status).subscribe(() => {
    agent.status = status; 
    this.cdr.detectChanges();
  });
}

getStatusClass(status: string) {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-700';
    case 'Inactive':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-yellow-100 text-yellow-700';
  }
}

openAssignModal(policy: any) {
  this.selectedPolicy = policy;
  this.selectedAgentForPolicy = '';
}

closeAssignModal() {
  this.selectedPolicy = null;
  this.selectedAgentForPolicy = '';
}

confirmAssignPolicy() {
  if (!this.selectedPolicy || !this.selectedAgentForPolicy) return;

  const agent = this.agents.find(
    a => a.id === this.selectedAgentForPolicy
  );

  this.api.assignPolicyToAgent(this.selectedPolicy.id, agent)
  .subscribe(() => {
    this.unassignedPolicies = this.unassignedPolicies.filter(
      p => p.id !== this.selectedPolicy.id
    );
    this.closeAssignModal();
    this.cdr.markForCheck();
  });

}






}

 

