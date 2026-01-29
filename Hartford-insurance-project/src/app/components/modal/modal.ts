import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-modal',
  standalone: true,
  imports: [CommonModule],
  template: ``
})
export class UiModal {
  @Input() open = false;
  @Input() title = '';
  @Input() maxWidth = 'max-w-md';

  @Output() close = new EventEmitter<void>();
}
