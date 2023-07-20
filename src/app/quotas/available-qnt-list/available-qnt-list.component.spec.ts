import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableQntListComponent } from './available-qnt-list.component';

describe('AvailableQntListComponent', () => {
  let component: AvailableQntListComponent;
  let fixture: ComponentFixture<AvailableQntListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailableQntListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableQntListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
