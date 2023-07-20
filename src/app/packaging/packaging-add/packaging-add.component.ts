import { PackagingService } from 'src/app/services/packaging.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { Packaging } from '../models/packaging';

@Component({
  selector: 'app-packaging-add',
  templateUrl: './packaging-add.component.html',
  styleUrls: ['./packaging-add.component.sass']
})
export class PackagingAddComponent implements OnInit {

  public name: string;
  public code: string;
  public id : string;
  public modalTitle : string;
  submitted = false;
  public form: FormGroup;
  constructor(public snackBar: MatSnackBar, private fb: FormBuilder,
    private dialogRef: MatDialogRef<PackagingAddComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private service: PackagingService, private notifHelper :NotificationHelper) {
      this.id = data.id;
      this.name = data.name;
      this.code = data.code;
      if(data.id == null)
      this.modalTitle = "Créer";
      else this.modalTitle = "Modifier";
     }

  ngOnInit(): void {
    this.createFrom();
  }
  save () {
    if(this.form.invalid) return;
    if(this.form.value.id == null)
      this.addForm(this.form.value);
    else this.updateForm(this.form.value);
  }
  updateForm(value: Packaging) {
    this.service.update(value).subscribe(msg => {
      this.notifHelper.showNotification('mat-primary', "La modification est terminée avec succès", 'top', 'right');
      this.dialogRef.close(value);
    }, (error) => {
      this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
      return;
    });
  }
  addForm(value: Packaging) {
    this.service.add(value).subscribe(msg => {
      this.notifHelper.showNotification('mat-primary', "L'enregistrement est terminé avec succès", 'top', 'right');
      this.dialogRef.close(value);
    }, (error) => {
      this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
      return;
    });
  }
  close (){
    this.dialogRef.close();
  }
  private createFrom() {
    this.form = this.fb.group({
      name: [this.name, [Validators.required]],
      code: [this.code, [Validators.required]],
      id : [this.id , []]
    });
  }

}
