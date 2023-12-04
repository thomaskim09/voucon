import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatPage } from './treat.page';

describe('TreatPage', () => {
  let component: TreatPage;
  let fixture: ComponentFixture<TreatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreatPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
