import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuLinkComponent } from './menu-link.component';

describe('MenuLinkComponent', () => {
  let component: MenuLinkComponent;
  let fixture: ComponentFixture<MenuLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MenuLinkComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
