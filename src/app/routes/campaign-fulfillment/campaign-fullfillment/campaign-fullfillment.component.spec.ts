import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignFullfillmentComponent } from './campaign-fullfillment.component';

describe('CampaignFullfillmentComponent', () => {
  let component: CampaignFullfillmentComponent;
  let fixture: ComponentFixture<CampaignFullfillmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignFullfillmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignFullfillmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
