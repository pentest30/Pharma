import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotaAddComponent } from './quota-add.component';

describe('QuotaAddComponent', () => {
  let component: QuotaAddComponent;
  let fixture: ComponentFixture<QuotaAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotaAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotaAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
