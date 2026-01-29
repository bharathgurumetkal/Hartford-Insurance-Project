import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

export type UserRole = 'admin' | 'agent' | 'client';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) { }

  getUserRole(): UserRole {
    return 'admin';
  }

  /**
   * Get the current logged-in customer's ID
   * In a real application, this would come from authentication state
   * For now, we'll use localStorage to simulate customer sessions
   */
  getCurrentCustomerId(): string {
    // Check if customer ID is stored in localStorage
    let customerId = localStorage.getItem('current_customer_id');

    // If not set, default to customer_1
    if (!customerId) {
      customerId = 'customer_1';
      localStorage.setItem('current_customer_id', customerId);
    }

    return customerId;
  }

  /**
   * Switch to a different customer (for testing purposes)
   */
  switchCustomer(customerId: string): void {
    localStorage.setItem('current_customer_id', customerId);
    // Trigger a page reload to refresh all data
    window.location.reload();
  }

  getPolicies() {
    return this.http.get("http://localhost:3000/policies")
  }

  getUser() {
    return this.http.get("http://localhost:3000/users")
  }

  getCustomers() {
    return this.http.get("http://localhost:3000/customers")
  }

  getAgents() {
    return this.http.get("http://localhost:3000/agents")
  }

  getClaims() {
    return this.http.get("http://localhost:3000/claims")
  }

  getDocuments() {
    return this.http.get("http://localhost:3000/documents")
  }

  deleteAgent(id: number) {
  return this.http.delete(`http://localhost:3000/agents/${id}`);
}

deletePolicy(id:number){
  return this.http.delete(`http://localhost:3000/policies/${id}`)
}

updateClaimStatus(id: string, status: 'Approved' | 'Rejected') {
  return this.http.patch(
    `http://localhost:3000/claims/${id}`,
    { status }
  );
}





}


