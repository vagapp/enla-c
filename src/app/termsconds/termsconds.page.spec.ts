import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermscondsPage } from './termsconds.page';

describe('TermscondsPage', () => {
  let component: TermscondsPage;
  let fixture: ComponentFixture<TermscondsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermscondsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermscondsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
