import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../../auth/services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-agent-modal',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './add-agent-modal.html',
})
export class AddAgentModal {

  @Output() close = new EventEmitter<void>();
  @Output() agentAdded = new EventEmitter<void>();

  email = '';
  commissionRate = 10;

  constructor(private api: Auth) {}

  addAgent() {
    const agent = {
      email: this.email,
      commissionRate: this.commissionRate,
      assignedCustomerIds: []
    };

    fetch('http://localhost:3000/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agent)
    }).then(() => {
      this.agentAdded.emit();
    });
  }
}
