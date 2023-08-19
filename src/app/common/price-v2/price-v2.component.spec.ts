import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceV2Component } from './price-v2.component';

describe('PriceV2Component', () => {
  let component: PriceV2Component;
  let fixture: ComponentFixture<PriceV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
