import { NotificationHelper } from 'src/app/shared/notif-helper';
import { PharmacologicalService } from 'src/app/services/pharmacological-class.service';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Pharmacological } from '../models/pharmacological-model';

@Component({
  selector: 'app-pharmacological-class-add',
  templateUrl: './pharmacological-class-add.component.html',
  styleUrls: ['./pharmacological-class-add.component.sass']
})
export class PharmacologicalClassAddComponent implements OnInit {
  public name: string;
  public description: string;
  public id : string;
  public modalTitle : string;
  submitted = false;
  public form: FormGroup;
  @Output() dbChange = new EventEmitter();
  notifyDataTabale: any;
  constructor(public snackBar: MatSnackBar, private fb: FormBuilder,
    private dialogRef: MatDialogRef<PharmacologicalClassAddComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private service: PharmacologicalService, private notifHelper :NotificationHelper) { 
      this.description = data.description;
       this.name = data.name;
       this.id = data.id;
       this.modalTitle = data.modalTitle

    }

  ngOnInit(): void {
    this.createFrom();
  }
  close() {
    this.dialogRef.close();
  }
  save() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
   
    if(this.form.value.id  === null ) 
      this.addPharmacologicalClass(this.form.value);
    else this.updatePharmacologicalClass(this.form.value);

  }
  updatePharmacologicalClass(value: Pharmacological) {
    this.service.updatePharmacologicalClass(value).subscribe(msg => {
      this.notifHelper.showNotification('mat-primary', "La modification est terminée avec succès", 'top', 'right');
      this.dialogRef.close(value);
      this.notifyDataTabale.emit();
    }, (error) => {
      this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
      return;
    });
  }
  addPharmacologicalClass(value: Pharmacological) {
    this.service.addPharmacologicalClass(value).subscribe(msg => {
      this.notifHelper.showNotification('mat-primary', "L'enregistrement est terminé avec succès", 'top', 'right');
      this.dialogRef.close(value);
      this.notifyDataTabale.emit();
    }, (error) => {
      this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
      return;
    });
  }
 
  private createFrom() {
    this.form = this.fb.group({
      description: [this.description, []],
      name: [this.name, [Validators.required]],
      id : [this.id , []]
    });
  }
}
