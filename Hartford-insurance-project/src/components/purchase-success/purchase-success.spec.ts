import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseSuccessComponent } from './purchase-success';

describe('PurchaseSuccessComponent', () => {
    let component: PurchaseSuccessComponent;
    let fixture: ComponentFixture<PurchaseSuccessComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PurchaseSuccessComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PurchaseSuccessComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
