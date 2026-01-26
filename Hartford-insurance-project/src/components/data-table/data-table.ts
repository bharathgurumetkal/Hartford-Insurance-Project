import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.html',
})
export class DataTable {
  @Input() columns: string[] = [];
  @Input() keys: string[] = [];
  @Input() data: any[] = [];
  @Input() actionsTemplate?: TemplateRef<any>;
}
