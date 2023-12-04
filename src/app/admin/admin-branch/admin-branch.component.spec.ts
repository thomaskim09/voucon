import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBranchComponent } from './admin-branch.component';

describe('AdminBranchComponent', () => {
  let component: AdminBranchComponent;
  let fixture: ComponentFixture<AdminBranchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminBranchComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
