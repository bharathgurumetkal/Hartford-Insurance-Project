import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {

  private apiUrl = 'http://localhost:3000/policies';

  constructor(private http: HttpClient) { }

  getPolicies(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getPolicyById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getPolicyTypes(): Observable<string[]> {
    return this.getPolicies().pipe(
      map(policies => {
        const types = policies.map(p => p.type);
        return [...new Set(types)];
      })
    );
  }

  filterPolicies(filters: {
    type?: string;
    minPremium?: number;
    maxPremium?: number;
    minCoverage?: number;
    maxCoverage?: number;
  }): Observable<any[]> {
    return this.getPolicies().pipe(
      map(policies => {
        return policies.filter(policy => {
          if (filters.type && policy.type !== filters.type) return false;
          if (filters.minPremium && policy.premium < filters.minPremium) return false;
          if (filters.maxPremium && policy.premium > filters.maxPremium) return false;
          if (filters.minCoverage && policy.coverage < filters.minCoverage) return false;
          if (filters.maxCoverage && policy.coverage > filters.maxCoverage) return false;
          return true;
        });
      })
    );
  }
}
