import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyFailedComponent } from './agency-failed.component';

describe('AgencyFailedComponent', () => {
  let component: AgencyFailedComponent;
  let fixture: ComponentFixture<AgencyFailedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyFailedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyFailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
