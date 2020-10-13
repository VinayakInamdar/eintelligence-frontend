import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteSpeedComponent } from './site-speed.component';

describe('SiteSpeedComponent', () => {
  let component: SiteSpeedComponent;
  let fixture: ComponentFixture<SiteSpeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteSpeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteSpeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
