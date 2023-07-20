import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrandService } from 'src/app/services/brand.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { Brand } from '../models/brand-model';

@Component({
  selector: 'app-brand-add',
  templateUrl: './brand-add.component.html',
  styleUrls: ['./brand-add.component.sass']
})
export class BrandAddComponent implements OnInit {
  public name: string;
  public description: string;
  public id : string;
  public modalTitle : string;
  submitted = false;
  public form: FormGroup;
  constructor(public snackBar: MatSnackBar, private fb: FormBuilder,
    private dialogRef: MatDialogRef<BrandAddComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private service: BrandService, private notifHelper :NotificationHelper) { 
      this.id = data.id;
      this.name = data.name;
      this.description = data.description;
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
      this.add(this.form.value);
    else this.update(this.form.value);
  }
  update(value: Brand) {
    this.service.update(value).subscribe(msg => {
      this.notifHelper.showNotification('mat-primary', "La modification est terminée avec succès", 'top', 'right');
      this.dialogRef.close(value);
    }, (error) => {
      this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
      return;
    });
  }
  add(value: Brand) {
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
      id : [this.id , []],
      description : [this.description , []]
    });
  }
}
