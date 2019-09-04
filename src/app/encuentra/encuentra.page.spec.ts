import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuentraPage } from './encuentra.page';

describe('EncuentraPage', () => {
  let component: EncuentraPage;
  let fixture: ComponentFixture<EncuentraPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncuentraPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncuentraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
