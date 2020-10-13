import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SourcesMediumsComponent } from './sources-mediums.component';

describe('SourcesMediumsComponent', () => {
  let component: SourcesMediumsComponent;
  let fixture: ComponentFixture<SourcesMediumsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SourcesMediumsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SourcesMediumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
