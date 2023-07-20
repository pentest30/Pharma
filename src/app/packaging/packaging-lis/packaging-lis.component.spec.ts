import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagingLisComponent } from './packaging-lis.component';

describe('PackagingLisComponent', () => {
  let component: PackagingLisComponent;
  let fixture: ComponentFixture<PackagingLisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackagingLisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagingLisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
