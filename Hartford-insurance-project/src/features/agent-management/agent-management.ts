import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../../auth/services/auth';
import { DataTable } from '../../components/data-table/data-table';
import { AddAgentModal } from '../add-agent-modal/add-agent-modal';
import { ConfirmModal } from '../confirm-modal/confirm-modal';

@Component({
  selector: 'app-agent-management',
  standalone: true,
  imports: [CommonModule, DataTable, AddAgentModal,ConfirmModal],
  templateUrl: './agent-management.html',
})
export class AgentManagement {

  agents: any[] = [];
  showAddModal = false;

  columns = ['Agent ID', 'Email', 'Commission', 'Status', 'Actions'];
  keys = ['id', 'email', 'commissionRate', 'status'];

  constructor(private api: Auth) {}

  ngOnInit() {
    this.loadAgents();
  }

  loadAgents() {
  this.api.getAgents().subscribe((agents: any) => {
    setTimeout(() => {
      this.agents = agents.map((a: any) => ({
        ...a,
        status: 'Active'
      }));
    });
  });
}


  



  electedAgentId: number | null = null;
  showConfirmModal = false;

  openDeleteModal(agentId: number) {
    this.electedAgentId = agentId;
    this.showConfirmModal = true;
  }

  confirmDelete() {
    if (this.electedAgentId == null) return;

    fetch(`http://localhost:3000/agents/${this.electedAgentId}`, {
      method: 'DELETE'
    }).then(() => {
      this.showConfirmModal = false;
      this.electedAgentId = null;
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
}
