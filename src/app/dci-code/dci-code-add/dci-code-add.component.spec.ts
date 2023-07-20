import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DciCodeAddComponent } from './dci-code-add.component';

describe('DciCodeAddComponent', () => {
  let component: DciCodeAddComponent;
  let fixture: ComponentFixture<DciCodeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DciCodeAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DciCodeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
