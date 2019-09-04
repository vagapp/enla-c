import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebasPage } from './pruebas.page';

describe('PruebasPage', () => {
  let component: PruebasPage;
  let fixture: ComponentFixture<PruebasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PruebasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PruebasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
