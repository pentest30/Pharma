import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PermissionService } from 'src/app/services/permission.service';
import { SectorService } from 'src/app/services/sector.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { Supplier } from '../../supplier/models/supplier-model';
import { Sector } from '../models/sector';

@Component({
  selector: 'app-sector-add',
  templateUrl: './sector-add.component.html',
  styleUrls: ['./sector-add.component.sass']
})

export class SectorAddComponent implements OnInit {
  form: FormGroup;
  name: string;
  code: string;
  organizationId : string;
  id : string;
  modalTitle: string;
  public organizations: Supplier[] = [];
  constructor(public snackBar: MatSnackBar, private fb: FormBuilder,
    private dialogRef: MatDialogRef<SectorAddComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private service: SectorService, private notifHelper :NotificationHelper, private permService : PermissionService) { 
      this.id = data.id;
      this.name = data.name;
      this.code = data.code;
      this.organizationId = data.organizationId;
      if(data.id == null)
      this.modalTitle = "Créer";
      else this.modalTitle = "Modifier";
    }

    ngOnInit(): void {
      this.createFrom();
    }
    save () {
      if(this.form.invalid) return;
      if(this.form.value.id == null){
          this.form.value.organizationId = this.permService.getOrganizationId();
          this.add(this.form.value)
        }
      else this.update(this.form.value);
    }
    update(value: Sector) {
      this.service.update(value).subscribe(msg => {
        this.notifHelper.showNotification('mat-primary', "La modification est terminée avec succès", 'top', 'right');
        this.dialogRef.close(value);
      }, (error) => {
        this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
        return;
      });
    }
    add(value: Sector) {
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
        organizationId : [this.organizationId , []],
        code : [this.code , [Validators.required]]
      });
    }

}
