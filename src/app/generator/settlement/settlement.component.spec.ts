import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementComponent } from './settlement.component';

describe('SettlementPage', () => {
  let component: SettlementComponent;
  let fixture: ComponentFixture<SettlementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettlementComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
