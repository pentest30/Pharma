import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLineCreditNoteComponent } from './add-line-credit-note.component';

describe('AddLineCreditNoteComponent', () => {
  let component: AddLineCreditNoteComponent;
  let fixture: ComponentFixture<AddLineCreditNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLineCreditNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLineCreditNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
