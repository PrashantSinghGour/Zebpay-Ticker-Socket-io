import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacificGridComponent } from './pacific-grid.component';

describe('PacificGridComponent', () => {
  let component: PacificGridComponent;
  let fixture: ComponentFixture<PacificGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PacificGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacificGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
