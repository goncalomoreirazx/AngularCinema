import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketSummaryComponent } from './ticket-summary.component';

describe('TicketSummaryComponent', () => {
  let component: TicketSummaryComponent;
  let fixture: ComponentFixture<TicketSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
