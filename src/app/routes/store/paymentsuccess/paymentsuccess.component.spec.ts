import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSuccessComponent } from './paymentsuccess.component';

describe('PaymentSuccessComponent', () => {
  let component: PaymentSuccessComponent;
  let fixture: ComponentFixture<PaymentSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
