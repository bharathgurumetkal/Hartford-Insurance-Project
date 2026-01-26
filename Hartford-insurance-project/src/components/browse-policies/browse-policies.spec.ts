import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowsePolicies } from './browse-policies';

describe('BrowsePolicies', () => {
  let component: BrowsePolicies;
  let fixture: ComponentFixture<BrowsePolicies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowsePolicies]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowsePolicies);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
