import { PickingZone, ZoneType } from './../models/picking-zeone';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PickingZoneService } from 'src/app/services/piking-zone.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { ZoneGroup } from 'src/app/zone-group/models/ZoneGroup';
import { ZoneGroupService } from 'src/app/services/zone-group.service';

@Component({
  selector: 'app-picking-zone-add',
  templateUrl: './picking-zone-add.component.html',
  styleUrls: ['./picking-zone-add.component.sass']
})
export class PickingZoneAddComponent implements OnInit {
  public name: string;
  public id : string;
  public modalTitle : string;
  submitted = false;
  zoneGroups: ZoneGroup[] = [];
  public form: FormGroup;
  zoneGroupId: any;
  order: number;
  public zoneTypes = ZoneType;
  zoneTypeList: (string | ZoneType)[];
  zoneType: any;
  constructor(public snackBar: MatSnackBar, private fb: FormBuilder,
    private dialogRef: MatDialogRef<PickingZoneAddComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private service: PickingZoneService,
    private zoneGroupService: ZoneGroupService,
    private notifHelper :NotificationHelper) {
      console.log(data);
      this.id = data.id;
      this.name = data.name;
      this.zoneType = data.zoneType;
      this.order = data.order;
      this.zoneGroupId = data.zoneGroupId;

      if(data.id == null)
      this.modalTitle = "Créer";
      else this.modalTitle = "Modifier";
    }

    ngOnInit(): void {
      this.zoneTypeList = Object.values(this.zoneTypes).filter(f => !isNaN(Number(f)));

      this.getZoneGroup();
      this.createFrom();
    }
    async getZoneGroup() {
      this.zoneGroups = await this.zoneGroupService.getAll().toPromise();
    }
    save () {
      if(this.form.invalid) return;
      if(this.form.value.id == null)
        this.add(this.form.value);
      else this.update(this.form.value);
    }
    update(value: PickingZone) {
      this.service.update(value).subscribe(msg => {
        this.notifHelper.showNotification('mat-primary', "La modification est terminée avec succès", 'top', 'right');
        this.dialogRef.close(value);
      }, (error) => {
        this.notifHelper.showNotification('mat-warn', error, 'top', 'right');

        return;
      });
    }
    add(value: PickingZone) {
      this.service.add(value).subscribe(msg => {
        this.notifHelper.showNotification('mat-primary', "L'enregistrement est terminé avec succès", 'top', 'right');
        this.dialogRef.close(value);
      }, (error) => {
        this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
        this.form.value.id = null;
        return;
      });
    }
    close (){
      this.dialogRef.close();
    }
    private createFrom() {
      this.form = this.fb.group({
        name: [this.name, [Validators.required]],
        order: [this.order, [Validators.required]],
        zoneType: [this.zoneType, [Validators.required]],
        zoneGroupId: [this.zoneGroupId, [Validators.required]],
        id : [this.id , []]
      });
    }

}
