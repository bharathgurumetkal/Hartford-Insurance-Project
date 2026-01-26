import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class UserData {
  private apiUsers = 'http://localhost:3000/users';
  private apiCustomers = 'http://localhost:3000/customers';
  private apiAgents = 'http://localhost:3000/agents';

  constructor(private http: HttpClient) {}

  // ===== Get User by ID =====
  getUserById(userId:number, callback:(user:any)=>void) {
    this.http.get<any>(`${this.apiUsers}/${userId}`).subscribe({
      next: user => callback(user),
      error: () => callback(null)
    });
  }

  // ===== Get Customer by UserId =====
  getCustomerByUserId(userId:number, callback:(customer:any)=>void) {
    this.http.get<any[]>(`${this.apiCustomers}?userId=${userId}`).subscribe({
      next: res => callback(res[0]),
      error: () => callback(null)
    });
  }

  // ===== Get Agent by UserId =====
  getAgentByUserId(userId:number, callback:(agent:any)=>void) {
    this.http.get<any[]>(`${this.apiAgents}?userId=${userId}`).subscribe({
      next: res => callback(res[0]),
      error: () => callback(null)
    });
  }

  // ===== Get Full Customer Profile (User + Customer) =====
  getFullCustomerProfile(userId:number, callback:(data:any)=>void) {
    this.getUserById(userId,(user)=>{
      if(!user){ callback(null); return; }

      this.getCustomerByUserId(userId,(customer)=>{
        callback({
          user,
          customer
        });
      });
    });
  }

   // Update customer profile
  updateCustomer(customer:any, callback:(res:any)=>void) {
    this.http.put(`${this.apiCustomers}/${customer.id}`, customer)
      .subscribe(res => callback(res));
  }

  
}
