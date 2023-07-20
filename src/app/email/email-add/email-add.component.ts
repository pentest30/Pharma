import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-email-add',
  templateUrl: './email-add.component.html',
  styleUrls: ['./email-add.component.sass']
})
export class EmailAddComponent implements OnInit {
  public email: string;
  public modalTitle : string;
  submitted = false;
  public form: FormGroup;
  constructor(public snackBar: MatSnackBar, private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmailAddComponent>,
    @Inject(MAT_DIALOG_DATA) data) { 
      this.email = data.email;
    }

  ngOnInit(): void {
    this.createFrom();
  }
  close(){
    this.dialogRef.close();

  }
  save() {
    if(this.form.invalid)
      return;
      this.dialogRef.close( this.form.value);
  }
  private createFrom() {
    this.form = this.fb.group({
      email: [this.email, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    });
  }
}
