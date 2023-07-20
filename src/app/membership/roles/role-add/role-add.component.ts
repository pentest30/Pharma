import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoleService } from 'src/app/services/roles.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { Role } from '../../models/user-role';

@Component({
  selector: 'app-role-add',
  templateUrl: './role-add.component.html',
  styleUrls: ['./role-add.component.sass']
})
export class RoleAddComponent implements OnInit {

  public name: string;
  public id : string;
  public modalTitle : string;
  submitted = false;
  public form: FormGroup;
  constructor(public snackBar: MatSnackBar, private fb: FormBuilder,
    private dialogRef: MatDialogRef<RoleAddComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private service: RoleService, private notifHelper :NotificationHelper) {
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
    this.service.update(value).subscribe(msg => {
      this.notifHelper.showNotification('mat-primary', "La modification est terminée avec succès", 'top', 'right');
      this.dialogRef.close(value);
    }, (error) => {
      this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
      return;
    });
  }
  addForm(value: Role) {
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
