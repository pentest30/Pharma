import { UploadFileService } from './../../services/upload-file.service';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from 'src/app/product/prodcut-models/product';
import { NotificationHelper } from 'src/app/shared/notif-helper';

@Component({
  selector: 'app-upload-image-add',
  templateUrl: './upload-image-add.component.html',
  styleUrls: ['./upload-image-add.component.sass']
})
export class UploadImageAddComponent implements OnInit {
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef;
  public files: any[] =[];
  public product : Product;
  constructor(private uploadService :UploadFileService,private dialogRef: MatDialogRef<UploadImageAddComponent>,
    @Inject(MAT_DIALOG_DATA) data,  private notif: NotificationHelper,) {
       this.product= data.product;
     
     }
  onClick() {
    const fileUpload = this.fileUpload.nativeElement; fileUpload.onchange = () => {
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        console.log(file);
        this.files.push({ data: file, inProgress: false, progress: 0  });
      }
      this.uploadFiles();
    };
    fileUpload.click();
  }
  private uploadFiles() {
    this.fileUpload.nativeElement.value = '';
    this.files.forEach(file => {
      this.uploadFile(file);
    });
  }
  uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file.data);
    file.inProgress = true;
    this.uploadService.upload( this.product, formData).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        file.inProgress = false;
        return of(`${file.data.name} upload failed.`);
      })).subscribe((event: any) => {
        if (typeof (event) === 'object') {
          this.notif.showNotification('mat-primary', "Le chargement de l'image est terminé avec succès", 'top', 'right');
          console.log(event.body);
        }
      });
  }
  onClose() {
    console.log(this.files);
    this.dialogRef.close(this.files);
  }
  ngOnInit(): void {
  }

}
