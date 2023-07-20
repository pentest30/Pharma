import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-bank-account-add',
  templateUrl: './bank-account-add.component.html',
  styleUrls: ['./bank-account-add.component.sass']
})
export class BankAccountAddComponent implements OnInit {

  public bankName: string;
  public bankCode: string;
  public id : string;
  public number: string;
  public modalTitle : string;
  submitted = false;
  public form: FormGroup;
  constructor(public snackBar: MatSnackBar, private fb: FormBuilder,
    private dialogRef: MatDialogRef<BankAccountAddComponent>,
    @Inject(MAT_DIALOG_DATA) data,) {
      this.id = data.id;
      this.bankName = data.bankName;
      this.bankCode = data.bankCode;
      this.number = data.number;
      if(data.id == null)
      this.modalTitle = "Créer";
      else this.modalTitle = "Modifier";
     }

  ngOnInit(): void {
    this.createFrom();
  }
  private createFrom() {
    this.form = this.fb.group({
      bankName: [this.bankName, [Validators.required]],
      bankCode: [this.bankCode, []],
      number : [this.number, [Validators.required]],
     
      id : [this.id , []]
    });
  }
  save() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    
    
    this.dialogRef.close(this.form.value);
  }
  close () {
    this.dialogRef.close();
  }
}
