import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

export type UserRole = 'admin' | 'agent' | 'client';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http:HttpClient){}
  getUserRole(): UserRole {
    return 'admin'; 
  }

  getPolicies(){
    return this.http.get("http://localhost:3000/policies")
  }

  getUser(){
    return this.http.get("http://localhost:3000/users")
  }

  getCustomers(){
    return this.http.get("http://localhost:3000/customers")
  }

  getAgents(){
    return this.http.get("http://localhost:3000/agents")
  }

  getClaims(){
    return this.http.get("http://localhost:3000/claims")
  }

  getDocuments(){
    return this.http.get("http://localhost:3000/documents")
  }





}


