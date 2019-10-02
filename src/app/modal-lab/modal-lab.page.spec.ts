import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLabPage } from './modal-lab.page';

describe('ModalLabPage', () => {
  let component: ModalLabPage;
  let fixture: ComponentFixture<ModalLabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalLabPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
