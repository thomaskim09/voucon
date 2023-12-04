import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdManagerPage } from './ad-manager.page';

describe('AdManagerPage', () => {
  let component: AdManagerPage;
  let fixture: ComponentFixture<AdManagerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdManagerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdManagerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
