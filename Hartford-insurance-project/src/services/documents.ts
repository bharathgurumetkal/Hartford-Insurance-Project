import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  private apiDocuments = 'http://localhost:3000/documents';

  constructor(private http: HttpClient) {}

  // Get documents by customerId
  getDocumentsByCustomerId(customerId: number, callback: (docs: any[]) => void) {
    this.http.get<any[]>(`${this.apiDocuments}?customerId=${customerId}`).subscribe({
      next: (docs) => callback(docs),
      error: () => callback([])
    });
  }

  // Add a new document
  addDocument(doc: any, callback: (res: any) => void) {
    this.http.post(this.apiDocuments, doc).subscribe({
      next: (res) => callback(res),
      error: () => callback(null)
    });
  }
}
