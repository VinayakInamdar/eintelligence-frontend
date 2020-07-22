import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Agency4Component } from './agency4.component';

describe('Agency4Component', () => {
  let component: Agency4Component;
  let fixture: ComponentFixture<Agency4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Agency4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Agency4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
