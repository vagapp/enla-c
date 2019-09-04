import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DosisPage } from './dosis.page';

describe('DosisPage', () => {
  let component: DosisPage;
  let fixture: ComponentFixture<DosisPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DosisPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DosisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
