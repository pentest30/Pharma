import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListsAddComponent } from './lists-add.component';

describe('ListsAddComponent', () => {
  let component: ListsAddComponent;
  let fixture: ComponentFixture<ListsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListsAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
