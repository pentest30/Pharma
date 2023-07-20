import { I } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeService } from 'src/app/services/employee.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.sass']
})
export class EmployeeAddComponent implements OnInit {
  public form: FormGroup;

  constructor( private dialogRef: MatDialogRef<EmployeeAddComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
    private fb: FormBuilder,
    private notif: NotificationHelper,
    private employeeService: EmployeeService) { }

  close() {
    this.dialogRef.close();
  }
  ngOnInit(): void {

    this.createFrom();
    if(this.data.employee != null) {
      this.form.patchValue(this.data.employee);
    } 
  }


  private createFrom() {
    this.form = this.fb.group({
      hrCode: [null, []],
      jobTitle: [null, [Validators.required]],
      name: [null, []],
      step: [null , []],
      id : [null , []],
    });
  }
  save() {
    if (this.form.invalid) {
      return;
    }
    if(this.form.value.id == null ) {
      this.employeeService.add(this.form.value).subscribe(msg => {
        this.notif.showNotification('mat-primary', "La creation est terminée avec succès", 'top', 'right');
        this.dialogRef.close(this.form.value);
       // this.notifyDataTabale.emit();
      }, (error) => {
        this.notif.showNotification('mat-warn', error, 'top', 'right');
        return;
      });
    } else {
      this.employeeService.update(this.form.value).subscribe(msg => {
        this.notif.showNotification('mat-primary', "La modification est terminée avec succès", 'top', 'right');
        this.dialogRef.close(this.form.value);
       // this.notifyDataTabale.emit();
      }, (error) => {
        this.notif.showNotification('mat-warn', error, 'top', 'right');
        return;
      });
    }
  
  }
}
