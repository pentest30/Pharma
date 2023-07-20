import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DciCodeListComponent } from './dci-code-list.component';

describe('DciCodeListComponent', () => {
  let component: DciCodeListComponent;
  let fixture: ComponentFixture<DciCodeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DciCodeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DciCodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
