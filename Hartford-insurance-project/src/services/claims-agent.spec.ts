import { TestBed } from '@angular/core/testing';

import { ClaimsAgent } from './claims-agent';

describe('ClaimsAgent', () => {
  let service: ClaimsAgent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClaimsAgent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
