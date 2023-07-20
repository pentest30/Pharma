import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ZoneGroupService } from 'src/app/services/zone-group.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { environment } from 'src/environments/environment';
import { ZoneGroup } from '../models/ZoneGroup';

@Component({
  selector: 'app-zone-group-add',
  templateUrl: './zone-group-add.component.html',
  styleUrls: ['./zone-group-add.component.sass']
})
export class ZoneGroupAddComponent implements OnInit {

  public title : string;
  public form: FormGroup;
  public defaultPrinterIp: string = environment.DefaultPrinterIp;
  constructor(
    public snackBar: MatSnackBar, 
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ZoneGroupAddComponent>,
    @Inject(MAT_DIALOG_DATA) private data, 
    private service: ZoneGroupService, 
    private notifHelper: NotificationHelper) {}

    ngOnInit(): void {
      this.createFrom();
      if(this.data != null) {
        this.form.setValue({
          id : this.data.id,
          name: this.data.name,
          order: this.data.order,
          printer: (this.data.printer) ? this.data.printer : this.defaultPrinterIp,
          description: ( this.data.description) ? this.data.description : null
        });
      }
    }
    private createFrom() {
      this.form = this.fb.group({
        id: [null, []],
        name: [null, [Validators.required]],
        order: [null, [Validators.required]],
        description: [null, []],
        printer: [this.defaultPrinterIp, []],
      });
    }
    close() {
      this.dialogRef.close();
    }
    save() {
      if (this.form.invalid)
        return;
      if (this.form.value.id === null)
        this.addZoneGroup(this.form.value);
      else this.updateZoneGroup(this.form.value);
  
    }
    updateZoneGroup(value: ZoneGroup) {
      this.service.updateZoneGroup(value).subscribe(msg => {
        this.notifHelper.showNotification('mat-primary', "L'enregistrement est terminé avec succès", 'top', 'right');
        this.dialogRef.close(this.form.value);
  
      }, (error) => {
        this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
        return;
      });
    }
    addZoneGroup(value: ZoneGroup) {
      this.service.addZoneGroup(value).subscribe(msg => {
        this.notifHelper.showNotification('mat-primary', "L'enregistrement est terminé avec succès", 'top', 'right');
        this.dialogRef.close(this.form.value);
  
      }, (error) => {
        this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
        return;
      });
    }

}
