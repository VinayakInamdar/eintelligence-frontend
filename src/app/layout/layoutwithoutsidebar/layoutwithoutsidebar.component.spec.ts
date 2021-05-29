import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutwithoutsidebarComponent } from './layoutwithoutsidebar.component';

describe('LayoutwithoutsidebarComponent', () => {
  let component: LayoutwithoutsidebarComponent;
  let fixture: ComponentFixture<LayoutwithoutsidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutwithoutsidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutwithoutsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
