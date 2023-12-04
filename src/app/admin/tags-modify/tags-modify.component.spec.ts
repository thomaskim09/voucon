import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsModifyPage } from './tags-modify.page';

describe('TagsModifyPage', () => {
  let component: TagsModifyPage;
  let fixture: ComponentFixture<TagsModifyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagsModifyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsModifyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
