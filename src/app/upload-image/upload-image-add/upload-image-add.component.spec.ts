import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadImageAddComponent } from './upload-image-add.component';

describe('UploadImageAddComponent', () => {
  let component: UploadImageAddComponent;
  let fixture: ComponentFixture<UploadImageAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadImageAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadImageAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
