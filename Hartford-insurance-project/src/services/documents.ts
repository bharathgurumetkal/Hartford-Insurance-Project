import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  private apiUrl = 'http://localhost:3000/claims';

  constructor(private http: HttpClient) {}

// Get all documents belonging to a customer
  getDocumentsByCustomerId(customerId: string | number, callback: (docs: any[]) => void) {
    this.http.get<any[]>(`${this.apiUrl}?customerId=${customerId}`).subscribe({
      next: (claims) => {
        // Extract documents from each claim
        const allDocs = claims.flatMap(claim => 
          claim.documents?.map((doc: string) => ({
            claimId: claim.claimId,
            policyName: claim.policyName,
            documentName: doc,
            date: claim.date
          })) || []
        );

        callback(allDocs);
      },
      error: () => callback([])
    });
  }

  // Add a new document
  addDocument(doc: any, callback: (res: any) => void) {
    this.http.post(this.apiUrl, doc).subscribe({
      next: (res) => callback(res),
      error: () => callback(null)
    });
  }

  





}




