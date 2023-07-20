import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DciService } from 'src/app/services/dci.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { Dci } from '../dci-models/dci';

@Component({
  selector: 'app-dci-add',
  templateUrl: './dci-add.component.html',
  styleUrls: ['./dci-add.component.sass']
})
export class DciAddComponent implements OnInit {

  public name: string;
  public id : string;
  public modalTitle : string;
  submitted = false;
  public form: FormGroup;
  constructor(public snackBar: MatSnackBar, private fb: FormBuilder,
    private dialogRef: MatDialogRef<DciAddComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private service: DciService, private notifHelper :NotificationHelper) {
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
      this.addDci(this.form.value);
    else this.updateDci(this.form.value);
  }
  updateDci(value: any) {
    this.service.update(value).subscribe(msg => {
      this.notifHelper.showNotification('mat-primary', "La modification est terminée avec succès", 'top', 'right');
      this.dialogRef.close(value);
    }, (error) => {
      this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
      return;
    });
  }
  addDci(value: Dci) {
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
      id : [this.id , []]
    });
  }

}
