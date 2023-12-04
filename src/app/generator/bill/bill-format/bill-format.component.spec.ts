import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillFormatComponent } from './bill-format.component';

describe('BillFormatPage', () => {
  let component: BillFormatComponent;
  let fixture: ComponentFixture<BillFormatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BillFormatComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
