import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Agency3Component } from './agency3.component';

describe('Agency3Component', () => {
  let component: Agency3Component;
  let fixture: ComponentFixture<Agency3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Agency3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Agency3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
