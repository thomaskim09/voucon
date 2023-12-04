import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingFormatPage } from './listing-format.page';

describe('ListingFormatPage', () => {
  let component: ListingFormatPage;
  let fixture: ComponentFixture<ListingFormatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListingFormatPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingFormatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
