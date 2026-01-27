import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  deleteAgent(id: number) {
  return this.http.delete(`http://localhost:3000/agents/${id}`);
}


  private apiUsers = 'http://localhost:3000/users';
  private apiCustomers = 'http://localhost:3000/customers';
  private apiAgents = 'http://localhost:3000/agents';

  constructor(private http: HttpClient) {}

  // ===== LOGIN =====
  login(email: string, password: string, callback: (user: any | null)=>void) {

    this.http.get<any[]>(this.apiUsers).subscribe({
      next: (users) => {
        console.log('🔍 Searching for user:', email);
        console.log('📋 Available users:', users.map(u => ({ email: u.email, password: u.password })));
        
        const user = users.find(u =>
          u.email === email && u.password === password
        );

        console.log('✅ Login result:', user ? 'SUCCESS' : 'FAILED - Email or password incorrect');

        if (!user) {
          callback(null);
          return;
        }

        // Create FAKE JWT Token
        const token = this.generateFakeJWT(user);

        // Store token + user
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        callback(user);
      },
      error: () => callback(null)
    });
  }

     // CHECK DUPLICATE EMAIL
  checkEmailExists(email: string, callback:(exists:boolean)=>void) {
    this.http.get<any[]>(this.apiUsers).subscribe(users => {
      const exists = users.some(u => u.email === email);
      callback(exists);
    });
  }

  // REGISTER
  register(fullName: string, email: string, password: string, role: string, callback:(success:boolean)=>void) {

    const newUser = { username: fullName, email, password, role };

    this.http.post<any>(this.apiUsers, newUser).subscribe({
      next: (createdUser) => {
        console.log('✅ User created:', createdUser);
        
        // Ensure ID is always numeric
        const userId = typeof createdUser.id === 'string' ? parseInt(createdUser.id, 10) : createdUser.id;
        console.log('📊 User ID:', userId, 'Type:', typeof userId);

        // create linked profile
        if (role === 'customer') {
          const customer = {
            userId: userId,
            fullName,
            phone: "",
            address: "",
            kycStatus: "Pending",
            communicationPreference: "Email",
            policyIds: []
          };
          this.http.post(this.apiCustomers, customer).subscribe({
            next: (cust: any) => {
              console.log('✅ Customer profile created:', cust);
              console.log('✅ Customer ID:', cust.id, 'User ID:', cust.userId);
            },
            error: (err) => console.error('❌ Customer creation failed:', err)
          });
        }

        if (role === 'agent') {
          const agent = {
            userId: userId,
            assignedCustomerIds: [],
            commissionRate: 10
          };
          this.http.post(this.apiAgents, agent).subscribe({
            next: (ag: any) => {
              console.log('✅ Agent profile created:', ag);
              console.log('✅ Agent ID:', ag.id, 'User ID:', ag.userId);
            },
            error: (err) => console.error('❌ Agent creation failed:', err)
          });
        }

        callback(true);
      },
      error: (err) => {
        console.error('❌ Registration failed:', err);
        callback(false);
      }
    });
  }

  // ===== FAKE JWT GENERATOR =====
  private generateFakeJWT(user:any): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      id: user.id,
      email: user.email,
      role: user.role,
      exp: new Date().getTime() + 60 * 60 * 1000 // 1 hour expiry
    }));
    const signature = btoa("fake-signature");
    return `${header}.${payload}.${signature}`;
  }

  // ===== TOKEN HELPERS =====
  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user')!);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getRole() {
    const user = this.getUser();
    return user?.role;
  }


getPolicies(){
    return this.http.get("http://localhost:3000/policies")
  }

  getUsers(){
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
