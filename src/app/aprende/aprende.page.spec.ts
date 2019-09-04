import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AprendePage } from './aprende.page';

describe('AprendePage', () => {
  let component: AprendePage;
  let fixture: ComponentFixture<AprendePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AprendePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AprendePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
