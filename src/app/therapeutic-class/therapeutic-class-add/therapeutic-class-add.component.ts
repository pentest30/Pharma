import { TherapeuticClassService } from 'src/app/services/therapeutic-class-service';
import { Component, Inject, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationHelper } from 'src/app/shared/notif-helper';
@Component({
  selector: 'app-therapeutic-class-add',
  templateUrl: './therapeutic-class-add.component.html',
  styleUrls: ['./therapeutic-class-add.component.sass']
})
export class TherapeuticClassAddComponent implements OnInit {
  public name: string;
  public description: string;
  public id : string;
  submitted = false;
  public form: FormGroup;
  @Output() dbChange = new EventEmitter();
  constructor(public snackBar: MatSnackBar, private fb: FormBuilder,
    private dialogRef: MatDialogRef<TherapeuticClassAddComponent>,
    @Inject(MAT_DIALOG_DATA) data, private service : TherapeuticClassService,  private notifHelper : NotificationHelper) { 
      this.description = data.description;
      this.name = data.name;
      this.id = data.id;
      this.notifHelper = new NotificationHelper(snackBar);
    }

  ngOnInit(): void {
    this.createFrom();
  }
  save() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
   
    if(this.form.value.id  === null ) 
      this.addTherapeuticClass(this.form.value);
    else this.updateTherapeuticClass(this.form.value);
    this.dbChange.emit(this.form.value);

  }
  updateTherapeuticClass(value: any) {
    this.service.updateTherapeuticCLass(value).subscribe(msg => {
      this.notifHelper.showNotification('mat-primary', "La modification est terminée avec succès", 'top', 'right');
      this.dialogRef.close(value);
      //this.notifyDataTabale.emit();
    }, (error) => {
      this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
      return;
    });
  }
  close() {
    this.dialogRef.close();
  }
 
  addTherapeuticClass(form: any) {
   
    this.service.addTherapeuticClass(form).subscribe(msg => {
      this.notifHelper.showNotification('mat-primary', "L'enregistrement est terminé avec succès", 'top', 'right');
      this.dialogRef.close(form);
     // this.notifyDataTabale.emit();
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
