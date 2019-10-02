import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAlarmPage } from './modal-alarm.page';

describe('ModalAlarmPage', () => {
  let component: ModalAlarmPage;
  let fixture: ComponentFixture<ModalAlarmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAlarmPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAlarmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
