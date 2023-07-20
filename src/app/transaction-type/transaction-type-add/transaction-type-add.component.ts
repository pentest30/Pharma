import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransactionTypeService } from 'src/app/services/transaction-type.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { TransactionTypeCode } from '../models/transactionType';

@Component({
  selector: 'app-transaction-type-add',
  templateUrl: './transaction-type-add.component.html',
  styleUrls: ['./transaction-type-add.component.sass']
})
export class TransactionTypeAddComponent implements OnInit {

  public title : string;
  public form: FormGroup;
  public transactionTypeCode = TransactionTypeCode;
  codeTypesTransaction: (string | TransactionTypeCode)[];

  constructor(
    public snackBar: MatSnackBar, 
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TransactionTypeAddComponent>,
    @Inject(MAT_DIALOG_DATA) private data, 
    private service: TransactionTypeService, 
    private notifHelper: NotificationHelper) {}

  ngOnInit(): void {
    this.codeTypesTransaction = Object.values(this.transactionTypeCode).filter(f => !isNaN(Number(f)));
    this.createFrom();
    if(this.data != null) {
      this.form.setValue({
        id : this.data.id,
        transactionTypeName: this.data.transactionTypeName,
        blocked: this.data.blocked,
        codeTransaction: this.data.codeTransaction,

      });
    }
  }
  private createFrom() {
    this.form = this.fb.group({
      id: [null, []],
      transactionTypeName: [null, [Validators.required]],
      blocked: [false, [Validators.required]],
      codeTransaction: [false, [Validators.required]],

    });
  }
  close() {
    this.dialogRef.close();
  }
  save() {
    if (this.form.invalid)
      return;
    if (this.form.value.id === null)
      this.addTransactionType(this.form.value);
    else this.updateTransactionType(this.form.value);

  }
  updateTransactionType(value) {
    this.service.updateTransactionType(value).subscribe(msg => {
      this.notifHelper.showNotification('mat-primary', "L'enregistrement est terminé avec succès", 'top', 'right');
      this.dialogRef.close(this.form.value);

    }, (error) => {
      this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
      return;
    });
  }
  addTransactionType(value) {
    this.service.addTransactionType(value).subscribe(msg => {
      this.notifHelper.showNotification('mat-primary', "L'enregistrement est terminé avec succès", 'top', 'right');
      this.dialogRef.close(this.form.value);

    }, (error) => {
      this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
      return;
    });
  }
}
