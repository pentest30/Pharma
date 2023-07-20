import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResevedQntListComponent } from './reseved-qnt-list.component';

describe('ResevedQntListComponent', () => {
  let component: ResevedQntListComponent;
  let fixture: ComponentFixture<ResevedQntListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResevedQntListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResevedQntListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
