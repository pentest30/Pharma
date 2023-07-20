import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Address } from 'src/app/address/address-model';
import { EmailModel } from 'src/app/email/email-model';
import { PhoneNumber } from 'src/app/phone/phone';
import { BankAccount } from '../../bank-account/bank-model/bank';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.sass']
})
export class ClientDetailComponent implements OnInit {
  customers: any[] = [];
  addresses: Address[] = [];
  emails: EmailModel[] = [];
  bankAccounts: BankAccount[] = [];
  phoneNumbers: PhoneNumber[] = [];
  gridLines: any;

  constructor(
    private dialogRef: MatDialogRef<ClientDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
      console.log(data)
      this.customers.push(data);
      this.addresses = data.addresses;
      this.emails = data.emails
      this.bankAccounts = data.bankAccounts;
      this.phoneNumbers = data.phoneNumbers;
    }

  ngOnInit(): void {
    this.gridLines = "Both";

  }

}
