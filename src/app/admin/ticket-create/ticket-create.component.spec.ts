import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketCreatePage } from './ticket-create.page';

describe('TicketCreatePage', () => {
  let component: TicketCreatePage;
  let fixture: ComponentFixture<TicketCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketCreatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
