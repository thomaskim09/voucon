import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressModifyPage } from './address-modify.page';

describe('AddressModifyPage', () => {
  let component: AddressModifyPage;
  let fixture: ComponentFixture<AddressModifyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressModifyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressModifyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
