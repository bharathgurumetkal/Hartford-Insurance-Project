import { Component ,Input} from '@angular/core';

@Component({
  selector: 'app-data-table',
  standalone:true,
  imports: [],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
})
export class DataTable {
 @Input() columns: string[] = [];
  @Input() keys: string[] = [];
  @Input() data: any[] = [];
}
