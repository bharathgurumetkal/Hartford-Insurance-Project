import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentManageClaims } from './agent-manage-claims';

describe('AgentManageClaims', () => {
  let component: AgentManageClaims;
  let fixture: ComponentFixture<AgentManageClaims>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentManageClaims]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentManageClaims);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
