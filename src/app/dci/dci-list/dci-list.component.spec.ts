import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DciListComponent } from './dci-list.component';

describe('DciListComponent', () => {
  let component: DciListComponent;
  let fixture: ComponentFixture<DciListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DciListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DciListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
