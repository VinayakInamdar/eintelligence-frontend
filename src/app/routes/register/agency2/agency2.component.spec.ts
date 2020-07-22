import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Agency2Component } from './agency2.component';

describe('Agency2Component', () => {
  let component: Agency2Component;
  let fixture: ComponentFixture<Agency2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Agency2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Agency2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
