import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Claims {
  private apiClaims = 'http://localhost:3000/claims';
  private apiCustomers = 'http://localhost:3000/customers';
  private apiPolicies = 'http://localhost:3000/policies';

  constructor(private http: HttpClient) {}

  // Get customer profile by logged-in userId
  getCustomerByUserId(userId: number, callback: (customer:any)=>void) {
    this.http.get<any[]>(`${this.apiCustomers}?userId=${userId}`).subscribe({
      next: (customers) => callback(customers[0]),
      error: () => callback(null)
    });
  }

  // Get claims by customerId (numeric ID)
  getClaimsByCustomerId(customerId: number, callback:(claims:any[])=>void) {
    this.http.get<any[]>(`${this.apiClaims}?customerId=${customerId}`).subscribe({
      next: (claims) => callback(claims),
      error: () => callback([])
    });
  }

  // ✅ Get policies list (optionally filtered by IDs)
  getPolicies(callback:(policies:any[])=>void, policyIds?: string[]) {
    this.http.get<any[]>(this.apiPolicies)
      .subscribe({
        next: (policies)=> {
          if (policyIds && policyIds.length > 0) {
            // Filter to only include policies in the policyIds array
            const filtered = policies.filter(p => policyIds.includes(p.id));
            callback(filtered);
          } else {
            callback(policies);
          }
        },
        error: ()=> callback([])
      });
  }

  // ✅ Get policies by specific IDs (for customer-owned policies)
  getPoliciesByIds(policyIds: string[], callback:(policies:any[])=>void) {
    if (!policyIds || policyIds.length === 0) {
      callback([]);
      return;
    }
    this.getPolicies(callback, policyIds);
  }

  // ✅ NEW — POST new claim
  fileClaim(claim:any, callback:(result:any)=>void) {
    this.http.post(this.apiClaims, claim)
      .subscribe({
        next: (res)=> callback(res),
        error: ()=> callback(null)
      });
  }

  // ✅ NEW — Upload documents
  uploadDocuments(formData: FormData, callback:(res:any)=>void) {
    // This hits backend upload API
    this.http.post('http://localhost:3000/upload', formData)
      .subscribe({
        next: (res)=> callback(res),
        error: ()=> callback(null)
      });
  }
  
}
