import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStatusPage } from './user-status.page';

describe('UserStatusPage', () => {
  let component: UserStatusPage;
  let fixture: ComponentFixture<UserStatusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserStatusPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
