import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreatePage } from './admin-create.page';

describe('AdminCreatePage', () => {
  let component: AdminCreatePage;
  let fixture: ComponentFixture<AdminCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCreatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
