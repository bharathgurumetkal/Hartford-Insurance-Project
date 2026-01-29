import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsService } from '../../../services/documents';
import { Claims } from '../../../services/claims';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documents.html',
  styleUrl: './documents.css',
})
export class Documents implements OnInit {
  documents: any[] = [];
  customerId!: number;
  isLoading = true;

  constructor(
    private documentsService: DocumentsService,
    private claimsService: Claims,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user')!);

    // Get customer ID first
    this.claimsService.getCustomerByUserId(user.id, (customer) => {
      if (!customer) return;
      this.customerId = customer.id;

      // Then get documents
      this.loadDocuments();
    });
  }

  loadDocuments() {
    this.documentsService.getDocumentsByCustomerId(this.customerId, (docs) => {
      this.documents = docs;
      this.isLoading = false;
      this.cd.detectChanges();
    });
  }

  getIconForType(type: string): string {
    if (type.includes('Aadhar')) return 'badge';
    if (type.includes('Claim')) return 'description';
    if (type.includes('Policy')) return 'policy';
    return 'folder';
  }
}
