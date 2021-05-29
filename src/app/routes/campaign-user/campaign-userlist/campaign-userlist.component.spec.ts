import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignUserlistComponent } from './campaign-userlist.component';

describe('CampaignUserlistComponent', () => {
  let component: CampaignUserlistComponent;
  let fixture: ComponentFixture<CampaignUserlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignUserlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignUserlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
