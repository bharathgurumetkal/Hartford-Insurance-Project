import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Get Agent Details
  getAgentByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/agents?userId=${userId}`);
  }

  // Get Assigned Customers
  getCustomersByIds(ids: any[]): Observable<any[]> {
    const query = ids.map(id => `id=${id}`).join('&');
    return this.http.get<any[]>(`${this.apiUrl}/customers?${query}`);
  }

  // Get Claims for Assigned Customers
  getClaimsByAgentId(agentId: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/claims?assignedAgentId=${agentId}`);
  }

  // Fallback: Fetch claims for specific customer IDs
  getClaimsByCustomerIds(customerIds: any[]): Observable<any[]> {
      const query = customerIds.map(id => `customerId=${id}`).join('&');
      return this.http.get<any[]>(`${this.apiUrl}/claims?${query}`);
  }

  // Update Claim Status
  updateClaimStatus(claimId: any, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/claims/${claimId}`, data);
  }


  // Communications
  getCommunications(agentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/communications?agentId=${agentId}`);
  }

  addCommunication(comm: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/communications`, comm);
  }
}
