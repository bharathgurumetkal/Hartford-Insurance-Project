import {  ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../../auth/services/auth';
import { DataTable } from '../../components/data-table/data-table';
import { AddAgentModal } from '../add-agent-modal/add-agent-modal';
import { ConfirmModal } from '../confirm-modal/confirm-modal';
import { FormsModule } from '@angular/forms';
import { AgentDetails } from '../../components/agent-details/agent-details';

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
  policies:any[]=[];
  selectedAgent:any=null;


  selectedAgentId: number | null = null;

  columns = ['Agent ID', 'Email', 'Commission', 'Status', 'Actions'];
  keys = ['id', 'email', 'commissionRate', 'status'];

  constructor(private api: Auth,private cdr:ChangeDetectorRef) {}

  ngOnInit() {
    this.loadAgents();
    this.api.getCustomers().subscribe((c:any)=>this.customers=c);
    this.api.getPolicies().subscribe((p:any)=>this.policies=p);
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
    console.log(this.agents)
  }



}

 

