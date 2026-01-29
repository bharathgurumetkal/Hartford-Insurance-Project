import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPolicies } from './assign-policies';

describe('AssignPolicies', () => {
  let component: AssignPolicies;
  let fixture: ComponentFixture<AssignPolicies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignPolicies]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignPolicies);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
