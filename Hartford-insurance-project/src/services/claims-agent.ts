import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ClaimsAgent {
   private apiAgents = 'http://localhost:3000/agents';
  private apiClaims = 'http://localhost:3000/claims';
  private apiCustomers = 'http://localhost:3000/customers';
  private apiPolicies = 'http://localhost:3000/policies';

  constructor(private http: HttpClient) {}

  // Get agent using logged-in userId
  getAgentByUserId(userId:number) {
    return this.http.get<any[]>(`${this.apiAgents}?userId=${userId}`);
  }

  // Get claims assigned to agent
  getClaimsByAgent(agentId:number) {
    return this.http.get<any[]>(`${this.apiClaims}?assignedAgentId=${agentId}`);
  }

  // Get customer by id
  getCustomerById(id:number) {
    return this.http.get<any>(`${this.apiCustomers}/${id}`);
  }

  // Get policy by id
  getPolicyById(id:number) {
    return this.http.get<any>(`${this.apiPolicies}/${id}`);
  }

  // Update claim status / remark
  updateClaim(claimId:number, data:any) {
    return this.http.patch(`${this.apiClaims}/${claimId}`, data);
  }

  // Update agent details
  updateAgent(agentId: any, data: any) {
    return this.http.patch(`${this.apiAgents}/${agentId}`, data);
  }
  
}
