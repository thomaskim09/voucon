import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTicketPage } from './user-ticket.page';

describe('UserTicketPage', () => {
  let component: UserTicketPage;
  let fixture: ComponentFixture<UserTicketPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTicketPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTicketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
