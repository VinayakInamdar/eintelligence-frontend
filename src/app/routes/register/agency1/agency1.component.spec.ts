import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Agency1Component } from './agency1.component';

describe('Agency1Component', () => {
  let component: Agency1Component;
  let fixture: ComponentFixture<Agency1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Agency1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Agency1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
