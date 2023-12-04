import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PushNoticePage } from './push-notice.page';

describe('PushNoticePage', () => {
  let component: PushNoticePage;
  let fixture: ComponentFixture<PushNoticePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PushNoticePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PushNoticePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
