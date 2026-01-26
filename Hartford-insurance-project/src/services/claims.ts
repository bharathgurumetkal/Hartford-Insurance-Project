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

  // ✅ NEW — Get policies list
  getPolicies(callback:(policies:any[])=>void) {
    this.http.get<any[]>(this.apiPolicies)
      .subscribe({
        next: (policies)=> callback(policies),
        error: ()=> callback([])
      });
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
    this.http.post('http://localhost:4000/upload', formData)
      .subscribe({
        next: (res)=> callback(res),
        error: ()=> callback(null)
      });
  }
  
}
