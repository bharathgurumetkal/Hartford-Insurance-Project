import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../auth/services/auth';
import { DataTable } from '../../app/components/data-table/data-table';


@Component({
  selector: 'app-policy-management',
  standalone: true,
  imports: [CommonModule, FormsModule,DataTable],
  templateUrl: './policy-management.html'
})
export class PolicyManagement {

  // ================= EXISTING =================
  policies:any[] = [];
  isEditMode = false;

  form = {
    id: '',
    name: '',
    type: '',
    premium: 0,
    coverage: 0,
    durationDays: 0
  };

  // ================= NEW (Assigned Policies) =================
  assignedPolicies: any[] = [];
  agents: any[] = [];

  selectedPolicy: any = null;
  selectedAgentId: string | null = null;
  showEditAgentModal = false;

  assignedPolicyColumns = [
    'Policy ID',
    'Policy Name',
    'Customer',
    'Premium',
    'Assigned Agent'
  ];

  assignedPolicyKeys = [
    'policyId',
    'policyName',
    'customerName',
    'premium',
    'assignedAgentName'
  ];

  constructor(private api: Auth, private cdr: ChangeDetectorRef) {}

  // ================= INIT =================
  ngOnInit(): void {
    this.getData();               // existing
    this.loadAssignedPolicies();  // new
    this.loadAgents();   
    this.cdr.detectChanges()  
    console.log(this.agents)       // new
  }

  // ================= EXISTING =================
  getData() {
    this.api.getPolicies().subscribe((pol: any) => {
      this.policies = [...pol];
      this.cdr.detectChanges();
    });
  }

  addPolicy() {
    if (!this.isFormValid()) return;

    const payload: any = { ...this.form };
    delete payload.id;

    this.api.pushPolicy(payload).subscribe(() => {
      this.getData();
      this.resetForm();
    });
  }

  editPolicy(policy: any) {
    this.form = { ...policy };
    this.isEditMode = true;
  }

  updatePolicy() {
    const id = this.form.id;
    if (!id) return;

    this.api.updatePolicy(this.form.id, this.form).subscribe(() => {
      this.getData();
      this.resetForm();
    });
  }

  deletePolicy(id: number) {
    const confirmed = confirm('Are you sure you want to delete this policy?');
    if (!confirmed) return;

    this.api.deletePolicy(id).subscribe(() => {
      this.policies = this.policies.filter(p => p.id !== id);
      this.cdr.detectChanges();
    });
  }

  resetForm() {
    this.form = {
      id: '',
      name: '',
      type: '',
      premium: 0,
      coverage: 0,
      durationDays: 0
    };
    this.isEditMode = false;
  }

  isFormValid() {
    return (
      this.form.name &&
      this.form.type &&
      this.form.premium > 0 &&
      this.form.coverage > 0 &&
      this.form.durationDays > 0
    );
  }

  // ================= NEW: LOAD ASSIGNED POLICIES =================
  loadAssignedPolicies() {
    this.api.getUnassignPolicies().subscribe((policies: any) => {
      this.assignedPolicies = policies
        .filter((p:any) => p.assignedAgent!==null) // only assigned
        .map((p:any) => ({
          ...p,
          customerName: p.customer?.name || '—',
          assignedAgentName: p.assignedAgent?.name || '—'
        }));
        console.log(this.assignedPolicies)
      this.cdr.detectChanges();
    });
  }

  // ================= NEW: LOAD AGENTS =================
  loadAgents() {
    this.api.getAgents().subscribe((agents: any) => {
      this.agents = agents;
    });
  }

  // ================= NEW: EDIT ASSIGNED AGENT =================
  openEditAgent(policy: any) {
    this.selectedPolicy = policy;
    this.selectedAgentId = policy.assignedAgent?.id;
    
    this.showEditAgentModal = true;
  }

  closeEditAgentModal() {
    this.showEditAgentModal = false;
    this.selectedPolicy = null;
    this.selectedAgentId = null;
  }

  updateAssignedAgent() {
    if (!this.selectedPolicy || !this.selectedAgentId) return;

    const agent = this.agents.find(a => a.id === this.selectedAgentId);
    if (!agent) return;

    const updatedPolicy = {
      ...this.selectedPolicy,
      assignedAgent: {
        id: agent.id,
        name: agent.fullName || agent.name
      }
    };

    this.api.updatePurchasedPolicy(this.selectedPolicy.id, updatedPolicy)
      .subscribe(() => {
        // Update UI immediately
        this.selectedPolicy.assignedAgent = updatedPolicy.assignedAgent;
        this.selectedPolicy.assignedAgentName = updatedPolicy.assignedAgent.name;

        this.closeEditAgentModal();
        this.cdr.detectChanges();
      });
  }

}
