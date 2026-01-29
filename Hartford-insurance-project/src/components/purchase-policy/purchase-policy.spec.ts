import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasePolicyComponent } from './purchase-policy';

describe('PurchasePolicyComponent', () => {
  let component: PurchasePolicyComponent;
  let fixture: ComponentFixture<PurchasePolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchasePolicyComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PurchasePolicyComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
