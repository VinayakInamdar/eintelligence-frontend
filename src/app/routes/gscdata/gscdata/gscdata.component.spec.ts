import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GscdataComponent } from './gscdata.component';

describe('GscdataComponent', () => {
  let component: GscdataComponent;
  let fixture: ComponentFixture<GscdataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GscdataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GscdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
