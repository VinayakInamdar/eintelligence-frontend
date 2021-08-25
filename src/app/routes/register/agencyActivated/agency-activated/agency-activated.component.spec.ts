import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyActivatedComponent } from './agency-activated.component';

describe('AgencyActivatedComponent', () => {
  let component: AgencyActivatedComponent;
  let fixture: ComponentFixture<AgencyActivatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyActivatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyActivatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
