import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapeuticClassListComponent } from './therapeutic-class-list.component';

describe('TherapeuticClassListComponent', () => {
  let component: TherapeuticClassListComponent;
  let fixture: ComponentFixture<TherapeuticClassListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TherapeuticClassListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TherapeuticClassListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
