import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveOpComponent } from './archive-op.component';

describe('ArchiveOpComponent', () => {
  let component: ArchiveOpComponent;
  let fixture: ComponentFixture<ArchiveOpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchiveOpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveOpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
