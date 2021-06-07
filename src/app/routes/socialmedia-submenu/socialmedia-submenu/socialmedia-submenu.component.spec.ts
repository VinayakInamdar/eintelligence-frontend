import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialmediaSubmenuComponent } from './socialmedia-submenu.component';

describe('SocialmediaSubmenuComponent', () => {
  let component: SocialmediaSubmenuComponent;
  let fixture: ComponentFixture<SocialmediaSubmenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialmediaSubmenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialmediaSubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
