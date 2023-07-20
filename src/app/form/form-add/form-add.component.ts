import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormService } from 'src/app/services/form.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { Form } from '../models/form-model';

@Component({
  selector: 'app-form-add',
  templateUrl: './form-add.component.html',
  styleUrls: ['./form-add.component.sass']
})
export class FormAddComponent implements OnInit {
  public name: string;
  public description: string;
  public id : string;
  public modalTitle : string;
  submitted = false;
  public form: FormGroup;
  constructor(public snackBar: MatSnackBar, private fb: FormBuilder,
    private dialogRef: MatDialogRef<FormAddComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private service: FormService, private notifHelper :NotificationHelper) {
      this.id = data.id;
      this.name = data.name;
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
  updateForm(value: any) {
    this.service.updateForm(value).subscribe(msg => {
      this.notifHelper.showNotification('mat-primary', "La modification est terminée avec succès", 'top', 'right');
      this.dialogRef.close(value);
    }, (error) => {
      this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
      return;
    });
  }
  addForm(value: Form) {
    this.service.addForm(value).subscribe(msg => {
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
      id : [this.id , []]
    });
  }

}
