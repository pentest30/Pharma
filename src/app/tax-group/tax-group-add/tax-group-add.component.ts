import { TaxGroup } from './../models/tax-group';
import { TaxGroupService } from './../../services/tax-group.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { DateAdapter } from '@angular/material/core';
@Component({
  selector: 'app-tax-group-add',
  templateUrl: './tax-group-add.component.html',
  styleUrls: ['./tax-group-add.component.sass']
})
export class TaxGroupAddComponent implements OnInit {
  public code: string;
  public name: string;
  public taxValue: number;
  public validFrom: Date;
  public validTo?: Date;
  public id: string;
  submitted = false;
  public title : string;
  public form: FormGroup;
  constructor(public snackBar: MatSnackBar, private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaxGroupAddComponent>,
    @Inject(MAT_DIALOG_DATA) data, 
    private service: TaxGroupService, 
    private notifHelper: NotificationHelper, 
    private dateAdapter: DateAdapter<Date>) {
    this.name = data.name;
    this.code = data.code;
    this.taxValue = data.taxValue;
    this.validFrom = data.validFrom;
    this.validTo = data.validTo;
    this.id = data.id;
    this.dateAdapter.setLocale('fr-FR');
    if(data.id!=null)
    this.title = "Modifier";
    else this.title = "Nouveau";
  }
  close() {
    this.dialogRef.close();
  }
  save() {
    if (this.form.invalid)
      return;
    if (this.form.value.id === null)
      this.addTaxGroup(this.form.value);
    else this.updateTaxGroup(this.form.value);

  }
  updateTaxGroup(value: TaxGroup) {
    this.service.updateTaxGroup(value).subscribe(msg => {
      this.notifHelper.showNotification('mat-primary', "L'enregistrement est terminé avec succès", 'top', 'right');
      this.dialogRef.close(this.form.value);

    }, (error) => {
      this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
      return;
    });
  }
  addTaxGroup(value: TaxGroup) {
    this.service.addTaxGroup(value).subscribe(msg => {
      this.notifHelper.showNotification('mat-primary', "L'enregistrement est terminé avec succès", 'top', 'right');
      this.dialogRef.close(this.form.value);

    }, (error) => {
      this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
      return;
    });
  }
  ngOnInit(): void {
    this.createFrom();
  }
  private createFrom() {
    this.form = this.fb.group({
      code: [this.code, []],
      name: [this.name, [Validators.required]],
      validFrom: [this.validFrom, [Validators.required]],
      taxValue: [this.taxValue, [Validators.required]],
      validTo: [this.validTo, []],
      id: [this.id, []]
    });
  }

}
