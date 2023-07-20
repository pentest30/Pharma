import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapeuticClassAddComponent } from './therapeutic-class-add.component';

describe('TherapeuticClassAddComponent', () => {
  let component: TherapeuticClassAddComponent;
  let fixture: ComponentFixture<TherapeuticClassAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TherapeuticClassAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TherapeuticClassAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
