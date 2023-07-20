import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBlProductComponent } from './add-bl-product.component';

describe('AddBlProductComponent', () => {
  let component: AddBlProductComponent;
  let fixture: ComponentFixture<AddBlProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBlProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBlProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
