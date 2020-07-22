import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaginComponent } from './campagin.component';

describe('CampaginComponent', () => {
  let component: CampaginComponent;
  let fixture: ComponentFixture<CampaginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
