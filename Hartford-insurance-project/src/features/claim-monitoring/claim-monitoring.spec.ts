import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimMonitoring } from './claim-monitoring';

describe('ClaimMonitoring', () => {
  let component: ClaimMonitoring;
  let fixture: ComponentFixture<ClaimMonitoring>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimMonitoring]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimMonitoring);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
