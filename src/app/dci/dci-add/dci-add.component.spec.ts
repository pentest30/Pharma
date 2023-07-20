import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DciAddComponent } from './dci-add.component';

describe('DciAddComponent', () => {
  let component: DciAddComponent;
  let fixture: ComponentFixture<DciAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DciAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DciAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
