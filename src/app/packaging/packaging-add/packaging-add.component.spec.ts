import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagingAddComponent } from './packaging-add.component';

describe('PackagingAddComponent', () => {
  let component: PackagingAddComponent;
  let fixture: ComponentFixture<PackagingAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackagingAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagingAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
